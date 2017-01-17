// Jeff Bigot 2017

var keysymdef = new Hash();

var kbd_snap ;

//=============================================================================
// forme physique du clavier 
//=============================================================================

var defval = function(vari,val){ 
        if (typeof vari === "undefined") {
            return val ;
        } else {
            return vari ;
        }
}


var KeyboardShape = new Class ({
    basesize :'', // taille de touche
    btwn :'',  // espace entre touches
    round :'', // rayon de congé des touches
    carac_size :'',
    font:'',// "Time New Roman",
    margin_x :'', // marge à gauche
    margin_y :'',
    k_margin_l :'', // % marge entre le bord gauche et le caractère
    k_margin_t :'', // % marge entre le bord supérieur et le haut du caractère
    k_margin_r :'', // % marge entre le bord gauche et le caractère
    k_margin_b :'',
    dot_size :'',
    height:'',
    width:'',
    keys_str:'',
    keys:[],
    initialize: function(){
    },
    load_json_params: function(str){
        var params = JSON.decode(str);
        this.basesize   = defval(params.basesize,50) ;
        this.btwn       = defval(params.btwn, 3) ;
        this.round      = defval(params.round,5) ;
        this.carac_size = defval(params.carac_size,16) ;
        this.font       = defval(params.font,"Time New Roman");
        this.margin_x   = defval(params.margin_x,10) ;
        this.margin_y   = defval(params.margin_y,10) ;
        this.k_margin_l = defval(params.k_margin_l,15);
        this.k_margin_t = defval(params.k_margin_t,5);
        this.k_margin_r = defval(params.k_margin_r,10);
        this.k_margin_b = defval(params.k_margin_b,17) ;
        this.dot_size   = defval(params.dot_size,6);

        this.width   = defval(params.width,"800px");
        this.height   = defval(params.height,"320px");

    },
    load_json_keys: function(str){
        this.keys = JSON.decode(str);
    },
    //TODO vérif !
    init_str: function(str){
        var lignes = kbd.keys_str.split("#");
        var i = 0 ;
        lignes.each(function(str){

            keys[i] = [];
            var j = 0 ;
            str = str.replace(/\n/g,"");
            var l2 = str.split("|");
            l2.each(function(st){ 
                var touche = st.split(":");
                var KN = touche[0] ;
                var KT = touche[1] || "N" ;
                var KS = touche[2] || 1 ;

                keys[i][j].c = KN ;
                keys[i][j].t = KT ;
                keys[i][j].s = KS ;
            });
        } );
    }

});

var kshape = new KeyboardShape();
//=============================================================================
// Disposition  
//=============================================================================

var KeyboardLayout = new Class ({
    layout:"",
    confLayout:"",
    initialize: function(){
    },
    valsFromScancode: function(scan){
        if (this.layout[scan]){
            return this.layout[scan];
        } else {
            return scan;
        }
    },
    valsFromConfcode: function(cc){
        if (this.layout[cc]){
            return this.layout[cc];
        } else {
            return cc;
        }
    },
    
    // initialisation à partir du fichier layout.conf
    // TODO terminer
    initFromConf: function(stri){
        var str = stri.replace(/^#*/g,"");
        str = str.replace(/^#.*$/gm,'');
        str = str.replace(/^\s*\n/gm,""); // empty lines
        str = str.replace(/ {2,}/g,"!"); // empty lines
        str = str.split("\n");
        confLayout = {};
        str.each( function(item){
            var ks = new Hash();
            var ar = item.split("!");
            ks.name = ar[1];
            ks.A = keysymdef[ar[3]]||"";//ar[3];
            ks.B = keysymdef[ar[2]]||"";//ar[2];
            ks.C = keysymdef[ar[5]]||"";//ar[5];
            ks.D = keysymdef[ar[4]]||"";//ar[4];
            confLayout[ar[1]]=ks;
        
        });
    }

});

var klayout = new KeyboardLayout();

//=============================================================================
// objet de dessin 
//=============================================================================

var KeyboardDrawer = new Class ({
    name: '',
    keys: '',
    shape: '', // lien vers KeyboardShape
    layout:'', // lien vers KeyboardLayout
    svgsnap: '',
    initialize: function(shape,layout){
        this.shape = shape;
        this.layout = layout;
    },
   svg: function(snap){        
        var kbd = this.shape;
        var lay = this.layout;
        svgsnap = snap;

        var xval = kbd.margin_x ;
        var yval = kbd.margin_y ;
        
        var kk ;

        var lignes = kbd.keys;
        lignes.each(function(ligne){
            xval = kbd.margin_x  ;
            ligne.each(function(key){ 
                //var KS ;
                if(typeOf(key)=="string"){
                    kk = new Key();
                    kk.init(lay.valsFromScancode(key),kbd);
                    kk.size = 1 ;
                } else if (typeOf(key) == "object"){
                    var type = key.t || "N" ;
                    if (type == "F" ){
                        kk = new FuncKey();
                    } else if (type == "I" ) {
                        kk = new IsoEnterKey();
                   } else if (type == "P" ) {
                        kk = new DotKey();
                   } else {
                        kk = new Key();
                   }

                   kk.init(lay.valsFromScancode(key.c),kbd);
                   kk.size = key.s || 1 ;
                }
                kk.posX = xval ;
                kk.posY = yval ;
                kk.svg(svgsnap,kbd);
                xval += kk.size*kbd.basesize+kbd.btwn ;
            });
            yval += kbd.basesize+kbd.btwn ;
        } );

      var h= Snap.select('#logo_ergodis');
       var l = h.clone();
        l.attr({viewBox: "0 0 436 145",width: 120,height: 30});
        svgsnap.append( l);
        var dy = yval+kbd.btwn ;
        l.transform("t0,"+dy);
      // snap.text(kbd.margin_x + im.getBBox()["width"] , yval+kbd.btwn+ im.getBBox()["height"] , "bepo.fr") ;

    }
});

var Key = new Class ({
    name: '',
    posX: '',
    posY: '',
    size: '',
    shape: '',
    dot: '',
    A: '',
    B: '',
    C: '',
    D: '',
    kl: '',
    kt: '',
    kr: '',
    kb: '',
    kbd:'',
    initialize: function(){},  
    init: function(str,kbd){
        this.A = str.A;
        this.B = str.B;
        this.C = str.C;
        this.D = str.D;
        this.F = str.F ;
        this.name = str.name ;
        this.kl = (kbd.k_margin_l * kbd.basesize) / 100  ;
        this.kt = (kbd.k_margin_t * kbd.basesize) / 100;
        this.kr = (kbd.k_margin_r * kbd.basesize) / 100;
        this.kb = (kbd.k_margin_b * kbd.basesize) / 100 ;
        this.kbd = kbd;
    }, 
    svgshape: function(snap){
        var key = snap.rect(this.posX,this.posY,this.kbd.basesize*this.size,this.kbd.basesize,this.kbd.round);
        key.addClass("k_std") ; 
        return key ;
    }, 
    svgtxt: function(snap){
        // le texte en haut à gauche
        var t1 = snap.text(this.posX,this.posY,this.A);
        t1.addClass("t_std t_u");
        t1.attr({"font-family": this.kbd.font, "font-size": this.kbd.carac_size+"px" });
        t1.transform("t"+this.kl+","+(this.kbd.carac_size+this.kt));

        var t2 = snap.text(this.posX,this.posY,this.B);
        t2.addClass("t_std t_n");
        t2.attr({"font-family": this.kbd.font, "font-size": this.kbd.carac_size+"px" });
        t2.transform("t"+this.kl+","+(this.kbd.basesize - this.kb));

        var t3 = snap.text(this.posX,this.posY,this.C);
        t3.addClass("t_std t_m").attr({"font-family": this.kbd.font, "font-size": this.kbd.carac_size+ "px" });
        var w_t3 = t3.getBBox()["width"]; 
        t3.transform("t"+(this.kbd.basesize*this.size-this.kr-w_t3)+","+(this.kbd.carac_size+this.kt));

        var t4 = snap.text(this.posX,this.posY,this.D);
        t4.addClass("t_std t_a").attr({"font-family": this.kbd.font, "font-size": this.kbd.carac_size+ "px" });

        var w_t4 = t4.getBBox()["width"]; 
        t4.transform("t"+(this.kbd.basesize*this.size-this.kr-w_t4)+","+(this.kbd.basesize - this.kb));

        var tn = snap.text(this.posX,this.posY,this.name);
        tn.addClass("t_std t_k");
        tn.attr({"font-family": this.kbd.font, "font-size":"8px" });
        var w_tn = tn.getBBox()["width"]; 
       // tn.transform("t"+(kbd.basesize*this.size/2-w_tn/2)+","+(kbd.basesize/2+4));   
        tn.transform("t"+(this.kbd.basesize*this.size-w_tn-this.kr)+","+(this.kbd.basesize/2+4));   
    },       
    svg: function(snap){

        var key;
        key = this.svgshape(snap);
        this.svgtxt(snap);
        return key;   
    }
});

var DotKey = new Class ({
    Extends: Key,  
    svgshape: function(s){
        this.parent(s); 
        var dot = s.circle(this.posX+this.kbd.basesize/2,this.posY+this.kbd.basesize/2,this.kbd.dot_size);
        dot.addClass("k_p");
    }
}); 

var FuncKey = new Class ({
    Extends: Key,
    svgtxt: function(snap){
        // le texte en haut à gauche
        var t1 = snap.text(this.posX,this.posY,this.F);
        t1.addClass("t_func t_f").attr({"font-family": this.kbd.font,"font-weight": "bold" , "font-size": this.kbd.carac_size+"px" });
        t1.transform("t"+this.kl+","+(this.kbd.carac_size+this.kt));

        var tn = snap.text(this.posX,this.posY,this.name);
        tn.addClass("t_func t_k").attr({"font-family": this.kbd.font, "font-size":"8px" });
        var w_tn = tn.getBBox()["width"];
        // (kbd.basesize*this.size/2-w_tn/2)
        tn.transform("t"+this.kl+","+(this.kbd.basesize/2+4)); //TODO 4 !! 
    },

    svg: function(snap){
        var key;
        key = this.svgshape(snap); 
        key.addClass("k_func");
        key.removeClass("k_std");
        this.svgtxt(snap);
        return key;

    }
});

var IsoEnterKey = new Class ({
    Extends: FuncKey,
    svgshape: function(s){
        var ssup = 1.25 ;
        var sinf = 1 ;
        
        var x = this.posX + this.kbd.round ;
        var y = this.posY ;
        //TODO corriger pour quand round est supérieur à ssup-sinf
        var petround = Math.min(this.kbd.round,ssup-sinf);

        var pt1 = "M"+x+","+y ;
        x += this.kbd.basesize * ssup - 2*this.kbd.round;
        pt1 += "L"+x+","+y ;
        pt1 += "a"+this.kbd.round+","+this.kbd.round+" 0 0 1 "+this.kbd.round+","+this.kbd.round;
        var iy = this.kbd.basesize *2 + this.kbd.btwn - 2*this.kbd.round ;
        pt1 += "l0,"+iy ;
        pt1 += "a-"+this.kbd.round+","+this.kbd.round+" 0 0 1 -"+this.kbd.round+","+this.kbd.round;
        var ix =  this.kbd.basesize*sinf - 2*this.kbd.round  ; 
        pt1 += "l-"+ix+",0" ;
        pt1 += "a-"+this.kbd.round+",-"+this.kbd.round+" 0 0 1 -"+this.kbd.round+",-"+this.kbd.round;
        iy = this.kbd.basesize + this.kbd.btwn - 2*this.kbd.round  ;
        pt1 += "l0,-"+iy ;
        pt1 += "a"+this.kbd.round+","+this.kbd.round+" 0 0 0 -"+this.kbd.round+",-"+this.kbd.round;
        ix =  (ssup - sinf) * this.kbd.basesize - 2*this.kbd.round  ; 
        pt1 += "l-"+ix+",0" ;
        pt1 += "a-"+this.kbd.round+",-"+this.kbd.round+" 0 0 1 -"+this.kbd.round+",-"+this.kbd.round;
        iy = this.kbd.basesize - 2*this.kbd.round  ;
        pt1 += "l0,-"+iy ;
        pt1 += "a"+this.kbd.round+","+this.kbd.round+" 0 0 1 "+this.kbd.round+",-"+this.kbd.round;

        var key = s.path(pt1);

        key.addClass("k_func");
        return key ;
    },
});

function toggle_t_m(){ $$('.t_m').toggle(); }
function toggle_t_k(){ $$('.t_k').toggle(); }
function toggle_t_u(){ $$('.t_u').toggle(); }
function toggle_t_n(){ $$('.t_n').toggle(); }
function toggle_t_a(){ $$('.t_a').toggle(); }
function toggle_k_p(){ $$('.k_p').toggle(); }

//  $('sel_c_k_c' ).addEvents({'change': mod_c_k_c });

function mod_c_k_c(){    
    $$('.k_std').setStyle("stroke","#"+this.value);  
    $$('.k_func').setStyle("stroke","#"+this.value);  
}
function mod_c_k_n(){    
    $$('.k_std').setStyle("fill","#"+this.value);  
}
function mod_c_k_f(){    
    $$('.k_func').setStyle("fill","#"+this.value);  
}
function mod_s_k_c(){    
    $$('.k_std').setStyle("strokeWidth",this.value);  
}

function mod_c_t_m(){    
    $$('.t_m').setStyle("fill","#"+this.value); 
}
function mod_c_t_u(){    
    $$('.t_u').setStyle("fill","#"+this.value);  
}
function mod_c_t_n(){    
    $$('.t_n').setStyle("fill","#"+this.value);  
}
function mod_c_t_a(){    
    $$('.t_a').setStyle("fill","#"+this.value);  
}
function mod_c_t_k(){    
    $$('.t_k').setStyle("fill","#"+this.value);  
}
function mod_c_t_f(){    
    $$('.t_f').setStyle("fill","#"+this.value);  
}
function mod_c_k_p(){    
    $$('.k_p').setStyle("fill","#"+this.value);  
}
function mod_c_b(){    
    $('svg').setStyle("background","#"+this.value);  
}

//transforme un fichier keysymdef enregistré dans un Hash
function keysymdefToKeys(strksd,ksd){
    var str = strksd ;
    str = str.replace(/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/g,""); //remove comments
    str = str.replace(/#define XK_/g,"");
    str = str.replace(/\/\//g,""); //remove //
    str = str.replace(/#endif/g,"");
    str = str.replace(/#ifdef XK_/g,"|");
    str = str.replace(/^\s*\n/gm,""); // empty lines

    str = str.replace(/ +/g, '%');
    str = str.split("\n");
    str.each( function(item){
        var txt = item.split("%");
        if(txt[1]){
            var t = String.fromCharCode(parseInt(txt[1],16));
            ksd[txt[0]]= t ;
        }
    });
    return ksd;
}

function kbd_redraw(){
    kbd_snap.clear();
    
    klayout.layout=JSON.decode($('layscan').get('value'));
    kshape.load_json_keys($('kbd_phys').get('value') );
    kshape.load_json_params($('kbd_params').get('value') );
    //console.log(kshape);
   // kshape.keys_str =$('kbd_phys').get('value') ; 
      
    
    $('svg').setStyle('height', kshape.height) ;
    $('svg').setStyle('width', kshape.width) ;
    $('svg').setStyle('border', '1px solid black') ;

    var kdrawer = new KeyboardDrawer(kshape,klayout); //Snap(1000,800)) ;
    kdrawer.svg(kbd_snap);

    $$('.k_std').setStyle("stroke","#"+$('sel_c_k_c').value);  
    $$('.k_func').setStyle("stroke","#"+$('sel_c_k_c').value);  
    $$('.k_std').setStyle("fill","#"+$('sel_c_k_n').value);  
    $$('.k_func').setStyle("fill","#"+$('sel_c_k_f').value);  
    $$('.k_std').setStyle("strokeWidth",$('sel_s_k_c').value);  
    $$('.t_m').setStyle("fill","#"+$('sel_c_t_m').value); 
    $$('.t_u').setStyle("fill","#"+$('sel_c_t_u').value);  
    $$('.t_n').setStyle("fill","#"+$('sel_c_t_n').value);  
    $$('.t_a').setStyle("fill","#"+$('sel_c_t_a').value);  
    $$('.t_k').setStyle("fill","#"+$('sel_c_t_k').value);  
    $$('.t_f').setStyle("fill","#"+$('sel_c_t_f').value);  
    $$('.k_p').setStyle("fill","#"+$('sel_c_k_p').value);  
    $('svg').setStyle("background","#"+$('sel_c_b').value);  

    return kdrawer ;
}


window.onload = function () {
    
    kbd_snap = Snap("#svg") ;
    
    // enregistrement des caractère unicode avec leur appellation keysymdef.h
    keysymdefToKeys($('ksys').innerHTML,keysymdef) ; 

    // enregistrement des touches selon le formalisme layout.conf
    // layoutstrTo( $('laykbd').innerHTML ,liste_key)

    var drawer = kbd_redraw();

   //pb du dimensionnement des cases
    //on ne peut pas utliser les styles !
  $('sel_t_m' ).addEvents({'change': toggle_t_m });
  $('sel_t_k' ).addEvents({'change': toggle_t_k });
  $('sel_t_u' ).addEvents({'change': toggle_t_u });
  $('sel_t_a' ).addEvents({'change': toggle_t_a });
  $('sel_k_p' ).addEvents({'change': toggle_k_p });
  $('sel_t_n' ).addEvents({'change': toggle_t_n });


  $('sel_c_k_c' ).addEvents({'change': mod_c_k_c });
  $('sel_c_k_n' ).addEvents({'change': mod_c_k_n });
  $('sel_c_k_f' ).addEvents({'change': mod_c_k_f });
  $('sel_s_k_c' ).addEvents({'change': mod_s_k_c });


  $('sel_c_t_m' ).addEvents({'change': mod_c_t_m });
  $('sel_c_t_u' ).addEvents({'change': mod_c_t_u });
  $('sel_c_t_n' ).addEvents({'change': mod_c_t_n });
  $('sel_c_t_a' ).addEvents({'change': mod_c_t_a });
  $('sel_c_t_k' ).addEvents({'change': mod_c_t_k });
  $('sel_c_t_f' ).addEvents({'change': mod_c_t_f });
  $('sel_c_k_p' ).addEvents({'change': mod_c_k_p });
  
  $('sel_c_b'   ).addEvents({'change': mod_c_b   });


  $('bt_redraw').addEvents({'click': kbd_redraw });
};


//=============================================================================
// sauvegarde 
//=============================================================================
/*
var dispo_xkb  = "TLDE|AE01|AE02|AE03|AE04|AE05|AE06|AE07|AE08|AE09|AE10|AE11|AE12|BKSP:F:1.75#"
    + "TAB:F:1.5|AD01|AD02|AD03|AD04|AD05|AD06|AD07|AD08|AD09|AD10|AD11|AD12|RTRN:I:I#"
    + "CAPS:F:1.75|AC01|AC02|AC03|AC04:P|AC05|AC06|AC07:P|AC08|AC09|AC10|AC11|BKSL#"
    + "LFSH:F:1.25|LSGT|AB01|AB02|AB03|AB04|AB05|AB06|AB07|AB08|AB09|AB10|RTSH:F:2.55#"
    + "LCTL:F:1.25|LWIN:F:1.25|LALT:F:1.25|SPCE:N:6.35|RALT:F:1.25|RWIN:F:1.25|MENU:F:1.25|RCTL:F:1.25";
var dispo_scancode = "29|02|03|04|05|06|07|08|09|0A|0B|0C|0D|0E:F:1.75#"
    + "0F:F:1.5|10|11|12|13|14|15|16|17|18|19|1A|1B|1C:I:I#"
    + "3A:F:1.75|1E|1F|20|21:P|22|23|24:P|25|26|27|28|2B#"
    + "2A:F:1.25|56|2C|2D|2E|2F|30|31|32|33|34|35|36:F:2.55#"
    + "1D:F:1.25|E01F:F:1.25|38:F:1.25|39:N:6.35|E038:F:1.25|E027:F:1.25|E02F:F:1.25|E01D:F:1.25" ;
    
var layout_scancode_bepo =    {
    "02" : { name : "02", A : "1", B : "\"", C : "„", D : "—", },
    "03" : { name : "03", A : "2", B : "«", C : "“", D : "<", },
    "04" : { name : "04", A : "3", B : "»", C : "”", D : ">", },
    "05" : { name : "05", A : "4", B : "(", C : "=", D : "[", },
    "06" : { name : "06", A : "5", B : ")", C : "=", D : "]", },
    "07" : { name : "07", A : "6", B : "@", C : "", D : "^", }, 
    "08" : { name : "08", A : "7", B : "+", C : "¬", D : "±", },
    "09" : { name : "09", A : "8", B : "-", C : "¼", D : "-", },
    "0A" : { name : "0A", A : "9", B : "/", C : "½", D : "÷", },
    "0B" : { name : "0B", A : "0", B : "*", C : "¾", D : "×", },

    "0D" : { name : "0D", A : "`", B : "%", C : "″", D : "‰", },
    "0E" : { name : "0E", A : "Back", B : "", C : "", D : "", }, 
    // deuxième ligne
    "0F" : { name : "0F", A : "Tab", B : "", C : "", D : "", },
    "10" : { name : "10", A : "B", B : "b", C : "¦", D : "|", },
    "11" : { name : "11", A : "É", B : "é", C : "˝", D : "´", },
    "12" : { name : "12", A : "P", B : "p", C : "§", D : "&", },
    "13" : { name : "13", A : "O", B : "o", C : "Œ", D : "œ", }, 
    "14" : { name : "14", A : "È", B : "è", C : "`", D : "`", }, 
    "15" : { name : "15", A : "!", B : "^", C : "", D : "¡", },
    "16" : { name : "16", A : "V", B : "v", C : "", D : "?", },
    "17" : { name : "17", A : "D", B : "d", C : "Ð", D : "ð", },
    "18" : { name : "18", A : "L", B : "l", C : "", D : "/", },
    "19" : { name : "19", A : "J", B : "j", C : "Ĳ", D : "ĳ", },
    "1A" : { name : "1A", A : "Z", B : "z", C : "Ə", D : "əə", },
    "1B" : { name : "1B", A : "W", B : "w", C : "", D : "˘", },
    "1C" : { name : "1C", A : "Entrée", B : "", C : "", D : "", },
    // 3 ème ligne 
    "1D" : { name : "1D", A : "Ctrl", B : "", C : "", D : "", },
    "1E" : { name : "1E", A : "A", B : "a", C : "Æ", D : "æ", },
    "1F" : { name : "1F", A : "U", B : "u", C : "Ù", D : "ù", },
    "20" : { name : "20", A : "I", B : "i", C : "¨", D : "¨", },
    "21" : { name : "21", A : "E", B : "e", C : "€", D : "€", },
    "22" : { name : "22", A : ",", B : ",", C : "’", D : "’", },
    "23" : { name : "23", A : "C", B : "c", C : "ſ", D : "©", },
    "24" : { name : "24", A : "T", B : "t", C : "Þ", D : "þ", },
    "25" : { name : "25", A : "S", B : "s", C : "ẞ", D : "ß", },
    "26" : { name : "26", A : "R", B : "r", C : "™", D : "®", },
    "27" : { name : "27", A : "N", B : "n", C : "", D : "~", },
    "28" : { name : "28", A : "M", B : "m", C : "º", D : "¯", },
    "29" : { name : "29", A : "#", B : "$", C : "¶", D : "–", },
    // 4ème ligne 
    "2A" : { name : "2A", A : "Maj", B : "", C : "", D : "", },
    "2B" : { name : "2B", A : "Ç", B : "ç", C : ",", D : "¸", },
    "2C" : { name : "2C", A : "À", B : "à", C : "", D : "\\", },
    "2D" : { name : "2D", A : "Y", B : "y", C : "‘", D : "{", },
    "2E" : { name : "2E", A : "X", B : "x", C : "’", D : "}", },
    "2F" : { name : "2F", A : ":", B : ".", C : "·", D : "…", },
    "30" : { name : "30", A : "K", B : "k", C : "", D : "~", },
    "31" : { name : "31", A : "?", B : "'", C : "̣̣̣̣̣̣̉", D : "¿", },
    "32" : { name : "32", A : "Q", B : "q", C : "̣̣", D : "°", },

    "33" : { name : "33", A : "G", B : "g", C : "̣", D : "µ", },
    "34" : { name : "34", A : "H", B : "h", C : "‡", D : "†", },
    "35" : { name : "35", A : "F", B : "f", C : "ª", D : "˛", },
    "36" : { name : "36", A : "Maj", B : "", C : "", D : "", },
    "37" : { name : "37", A : "a", B : "b", C : "c", D : "d", },
    "38" : { name : "38", A : "Alt", B : "", C : "", D : "", },
    "39" : { name : "39", A : "insec", B : "espace", C : "insec fine", D : "_", },
    "3A" : { name : "3A", A : "Ver Maj", B : "", C : "", D : "", },
    "56" : { name : "56", A : "Ê", B : "ê", C : "", D : "/", }, 
    //  E01F ║ 38  ║          39           ║  E038 ║ E027 ║ E02F ║ E01D ║  ║ 53 
    "E01F" : { name : "E01F", A : "Sys", B : "", C : "", D : "", }, 
    "E038" : { name : "E038", A : "Altgr", B : "", C : "", D : "", },
    "E027" : { name : "E027", A : "Sys", B : "", C : "", D : "", },
    "E02F" : { name : "E02F", A : "Menu", B : "b", C : "c", D : "d", },
    "E01D" : { name : "E01D", A : "Ctrl", B : "b", C : "c", D : "d", },
};
*/
//=============================================================================
//=============================================================================


