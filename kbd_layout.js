// Jeff Bigot 2017

// ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────╔════════╗
// │    │    │    │    │    │    │    │    │    │    │    │    │    ║        ║
// │ 29 │ 02 │ 03 │ 04 │ 05 │ 06 │ 07 │ 08 │ 09 │ 0A │ 0B │ 0C │ 0D ║   0E   ║
// ╔════╧══╗─┴──┬─┴──┬─┴──┬─┴──┬─┴──┬─┴──┬─┴──┬─┴──┬─┴──┬─┴──┬─┴──┬─╚══╦═════╣
// ║       ║    │    │    │    │    │    │    │    │    │    │    │    ║     ║
// ║  0F   ║ 10 │ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │ 1A │ 1B ║  1C ║
// ╠═══════╩╗───┴┬───┴┬───┴┬───┴┬───┴┬───┴┬───┴┬───┴┬───┴┬───┴┬───┴┬───╚╗    ║
// ║        ║    │    │    │    │    │    │    │    │    │    │    │    ║    ║
// ║  3A    ║ 1E │ 1F │ 20 │ 21 │ 22 │ 23 │ 24 │ 25 │ 26 │ 27 │ 28 │ 2B ║    ║
// ╠══════╦═╝──┬─┴──┬─┴──┬─┴─══─┴──┬─┴──┬─┴─══─┴──┬─┴──┬─┴──┬─┴──╔═╧════╩════╣
// ║      ║    │    │    │    │    │    │    │    │    │    │    ║           ║
// ║  2A  ║ 56 │ 2C │ 2D │ 2E │ 2F │ 30 │ 31 │ 32 │ 33 │ 34 │ 35 ║     36    ║
// ╠══════╩╦═══╧══╦═╧═══╦╧════╧════╧════╧════╧══╦═╧════╧╦═══╧══╦═╩════╦══════╣
// ║       ║      ║     ║                       ║       ║      ║      ║      ║  ╔════╗
// ║  1D   ║ E01F ║ 38  ║          39           ║  E038 ║ E027 ║ E02F ║ E01D ║  ║ 53 ║
// ╚═══════╩══════╩═════╩═══════════════════════╩═══════╩══════╩══════╩══════╝  ╚════╝

//--------------



var phys = {
    basesize : 50 , // taille de touche
    btwn : 3 ,  // espace entre touches
    round : 5 , // rayon de congé des touches
    carac_size : 16 ,
    font: "Time New Roman",
    margin_x : 10 , // marge à gauche
    margin_y : 10 ,
    k_margin_l : 15 , // % marge entre le bord gauche et le caractère
    k_margin_t : 5 , // % marge entre le bord supérieur et le haut du caractère
    k_margin_r : 10, // % marge entre le bord gauche et le caractère
    k_margin_b : 17 ,
    dot_size : 6,
    disp : "29|02|03|04|05|06|07|08|09|0A|0B|0C|0D|0E:F:1.75#"
    + "0F:F:1.5|10|11|12|13|14|15|16|17|18|19|1A|1B|1C:I:I#"
    + "3A:F:1.75|1E|1F|20|21:P|22|23|24:P|25|26|27|28|2B#"
    + "2A:F:1.25|56|2C|2D|2E|2F|30|31|32|33|34|35|36:F:2.55#"
    + "1D:F:1.25|E01F:F:1.25|38:F:1.25|39:N:6.35|E038:F:1.25|E027:F:1.25|E02F:F:1.25|E01D:F:1.25"
 // |53:F:1.25"

};

//TODO selection de type sur A B C et D pour préciser l'affichage.

var liste_key ;
    
var sav_liste_key =    {
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
    "0C" : { name : "0C", A : "°", B : "=", C : "'", D : "″", },
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

var kbd_snap = new Class ({
    name: '',
    keys: '',
    forme: '',
    snap: '',
    initialize: function(vars,snap){
        this.forme = vars;
        this.snap = snap;
    },
    draw: function(){
        var kbd = this.forme;
        var snap = this.snap;
        var xval = kbd.margin_x ;
        var yval = kbd.margin_y ;

        var lignes = kbd.disp.split("#");
        lignes.each(function(str){
            xval = kbd.margin_x  ;
            var l2 = str.split("|");
            l2.each(function(st){ 
                var touche = st.split(":");
                var KN = touche[0] ;
                var KT = touche[1] ;
                var KS = touche[2] || 1 ;

                var kk ;
                if (!KT){
                    kk = new Key();
                } else if (KT == "F" ){
                    kk = new FuncKey();
                } else if (KT == "I" ) {
                    kk = new IsoEnterKey();
                } else if (KT == "P" ) {
                    kk = new DotKey();
                } else {
                    kk = new Key();
                }
                kk.posX = xval ;
                kk.posY = yval ;
                kk.size = KS ;
                kk.init(liste_key[KN],kbd);
                kk.sqr(snap,kbd);
                xval += KS*kbd.basesize+kbd.btwn ;
            });
            yval += kbd.basesize+kbd.btwn ;
        } );

       var im = snap.image("120px-Ergodis-logo-normal.png", kbd.margin_x ,yval+kbd.btwn);
       //snap.text(kbd.margin_x + im.getBBox()["width"] , yval+kbd.btwn+ im.getBBox()["height"] , "bepo.fr") ;
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
    initialize: function(){},  
    init: function(str,kbd){
        this.A = str.A;
        this.B = str.B;
        this.C = str.C;
        this.D = str.D;
        this.name = str.name ;
        this.kl = (kbd.k_margin_l * kbd.basesize) / 100  ;
        this.kt = (kbd.k_margin_t * kbd.basesize) / 100;
        this.kr = (kbd.k_margin_r * kbd.basesize) / 100;
        this.kb = (kbd.k_margin_b * kbd.basesize) / 100 ;



    }, 
    shape: function(snap,kbd){
        var key = snap.rect(this.posX,this.posY,kbd.basesize*this.size,kbd.basesize,kbd.round);
        key.addClass("k_std") ; 
        return key ;
    }, 
    txt: function(snap,kbd){
        // le texte en haut à gauche
        var t1 = snap.text(this.posX,this.posY,this.A);
        t1.addClass("t_std t_u");
        t1.attr({"font-type": kbd.font, "font-size": kbd.carac_size+"px" });
        t1.transform("t"+this.kl+","+(kbd.carac_size+this.kt));

        var t2 = snap.text(this.posX,this.posY,this.B);
        t2.addClass("t_std t_n");
        t2.attr({"font-type": kbd.font, "font-size": kbd.carac_size+"px" });
        t2.transform("t"+this.kl+","+(kbd.basesize - this.kb));

        var t3 = snap.text(this.posX,this.posY,this.C);
        t3.addClass("t_std t_m").attr({"font-type": kbd.font, "font-size": kbd.carac_size+ "px" });
        var w_t3 = t3.getBBox()["width"]; 
        t3.transform("t"+(kbd.basesize*this.size-this.kr-w_t3)+","+(kbd.carac_size+this.kt));

        var t4 = snap.text(this.posX,this.posY,this.D);
        t4.addClass("t_std t_a").attr({"font-type": kbd.font, "font-size": kbd.carac_size+ "px" });

        var w_t4 = t4.getBBox()["width"]; 
        t4.transform("t"+(kbd.basesize*this.size-this.kr-w_t4)+","+(kbd.basesize - this.kb));

        var tn = snap.text(this.posX,this.posY,this.name);
        tn.addClass("t_std t_k");
        tn.attr({"font-type": kbd.font, "font-size":"8px" });
        var w_tn = tn.getBBox()["width"]; 
       // tn.transform("t"+(kbd.basesize*this.size/2-w_tn/2)+","+(kbd.basesize/2+4));   
        tn.transform("t"+(kbd.basesize*this.size-w_tn-this.kr)+","+(kbd.basesize/2+4));   
    },       
    sqr: function(snap,kbd){

        var key;
        key = this.shape(snap,kbd);
        this.txt(snap,kbd);
        return key;   
    }
});

var DotKey = new Class ({
    Extends: Key,  
    shape: function(s,k){
        this.parent(s,k); 
        var dot = s.circle(this.posX+k.basesize/2,this.posY+k.basesize/2,k.dot_size);
        dot.addClass("k_p");
    }
}); 

var FuncKey = new Class ({
    Extends: Key,
    txt: function(snap,kbd){
        // le texte en haut à gauche
        var t1 = snap.text(this.posX,this.posY,this.A);
        t1.addClass("t_func t_f").attr({"font-type": kbd.font,"font-weight": "bold" , "font-size": kbd.carac_size+"px" });
        t1.transform("t"+this.kl+","+(kbd.carac_size+this.kt));

        var tn = snap.text(this.posX,this.posY,this.name);
        tn.addClass("t_func t_k").attr({"font-type": kbd.font, "font-size":"8px" });
        var w_tn = tn.getBBox()["width"];
        // (kbd.basesize*this.size/2-w_tn/2)
        tn.transform("t"+this.kl+","+(kbd.basesize/2+4)); //TODO 4 !! 
    },

    sqr: function(snap,kbd){
        var key;
        key = this.shape(snap,kbd); 
        key.addClass("k_func");
        key.removeClass("k_std");
        this.txt(snap,kbd);
        return key;

    }
});

var IsoEnterKey = new Class ({
    Extends: FuncKey,
    shape: function(s,k){
        var ssup = 1.25 ;
        var sinf = 1 ;
        
        var x = this.posX + k.round ;
        var y = this.posY ;

        var pt1 = "M"+x+","+y ;
        x += k.basesize * ssup - 2*k.round;
        pt1 += "L"+x+","+y ;
        pt1 += "a"+k.round+","+k.round+" 0 0 1 "+k.round+","+k.round;
        var iy = k.basesize *2 + k.btwn - 2*k.round ;
        pt1 += "l0,"+iy ;
        pt1 += "a-"+k.round+","+k.round+" 0 0 1 -"+k.round+","+k.round;
        var ix =  k.basesize*sinf - 2*k.round  ; 
        pt1 += "l-"+ix+",0" ;
        pt1 += "a-"+k.round+",-"+k.round+" 0 0 1 -"+k.round+",-"+k.round;
        iy = k.basesize + k.btwn - 2*k.round  ;
        pt1 += "l0,-"+iy ;
        pt1 += "a"+k.round+","+k.round+" 0 0 0 -"+k.round+",-"+k.round;
        ix =  (ssup - sinf) * k.basesize - 2*k.round  ; 
        pt1 += "l-"+ix+",0" ;
        pt1 += "a-"+k.round+",-"+k.round+" 0 0 1 -"+k.round+",-"+k.round;
        iy = k.basesize - 2*k.round  ;
        pt1 += "l0,-"+iy ;
        pt1 += "a"+k.round+","+k.round+" 0 0 1 "+k.round+",-"+k.round;

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
    $$('.k_std').setStyle("stroke",this.value);  
    $$('.k_func').setStyle("stroke",this.value);  
}
function mod_c_k_n(){    
    $$('.k_std').setStyle("fill",this.value);  
}
function mod_c_k_f(){    
    $$('.k_func').setStyle("fill",this.value);  
}
function mod_s_k_c(){    
    $$('.k_std').setStyle("strokeWidth",this.value);  
}

function mod_c_t_m(){    
    $$('.t_m').setStyle("fill",this.value);  
}
function mod_c_t_u(){    
    $$('.t_u').setStyle("fill",this.value);  
}
function mod_c_t_n(){    
    $$('.t_n').setStyle("fill",this.value);  
}
function mod_c_t_a(){    
    $$('.t_a').setStyle("fill",this.value);  
}
function mod_c_t_k(){    
    $$('.t_k').setStyle("fill",this.value);  
}
function mod_c_t_f(){    
    $$('.t_f').setStyle("fill",this.value);  
}
function mod_c_k_p(){    
    $$('.k_p').setStyle("fill",this.value);  
}
function mod_c_b(){    
    $('svg').setStyle("background",this.value);  
}

window.onload = function () {
    
    liste_key = sav_liste_key ; 
    var c_t_m = $('sel_c_t_m').value ;
    var c_t_u = $('sel_c_t_u').value ;
    var c_t_a = $('sel_c_t_a').value ;
    var c_t_f = $('sel_c_t_f').value ;
    var c_t_k = $('sel_c_t_k').value ;
    var c_t_n = $('sel_c_t_n').value ;
   
    var f_t_std = "Lucida Console" ; //"Time New Roman" ;

    var ks = Snap("#svg");
    $('svg').setStyle('height', '320px') ;
    $('svg').setStyle('width', '800px') ;
    $('svg').setStyle('border', '1px solid black') ;

    phys.font = f_t_std ;
    var kbd = new kbd_snap(phys,ks); //Snap(1000,800)) ;
    kbd.draw();
    $$('.t_m').setStyle("fill", c_t_m) ;
    $$('.t_u').setStyle("fill", c_t_u) ;
    $$('.t_a').setStyle("fill", c_t_a) ;
    $$('.t_f').setStyle("fill", c_t_f) ;
    $$('.t_k').setStyle("fill", c_t_k) ;
    $$('.t_n').setStyle("fill", c_t_n) ;

   //pb du dimensionnement des cases
    //on ne peut pas utliser les styles !
    //
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
  
  $('sel_c_b' ).addEvents({'change': mod_c_b });

};
