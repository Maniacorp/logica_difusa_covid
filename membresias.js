//Membresias

//funcion Membresia booleana
let funcionBool = (x , x0) => x< x0 ? 0.0 : 1.0

let funcionInvBool = (x , x0) => x< x0 ? 1.0 : 0.0

//funcion Membresia de grado 
let funcionGrado = (x ,x0 , x1) => x <= x0 ? 0.0 : x>x0 && x<x1 ? (x/(x1-x0)) - (x0/(x1-x0)): 1.0

let funcionInvGrado = (x , x0 , x1) => x <= x0 ? 1.0 :  x>x0 && x<=x1 ? - (x/(x1-x0)) + (x0/(x1-x0)): 0.0

//funcion Membresia de Triangulo
let funcionTriangulo = (x , x0 , x1 , x2) => x <= x0 ? 0.0 : x>x0 && x<=x1 ? ((x/(x1-x0)) - (x0/(x1-x0))) : x>x1 && x<=x2 ? -(x/(x2-x0)) + (x2/(x2-x0)) : 0.0

let funcionInvTriangulo = (x , x0 , x1 , x2) => x <= x0 ? 1.0 : x>x0 && x<=x1 ? - (x/(x1-x0)) + (x0/(x1-x0)) : x>x1 && x<x2 ?  (x/(x2-x1)) - (x2/(x2-x0)) : 1.0


//funcion Membresia de Trapezoidal
let funcionTrapezoidal = (x , x0 , x1 , x2 , x3) => x <= x0 ? 0.0 : x>x0 && x<=x1 ? (x/(x1-x0)) - (x0/(x1-x0)) : x>x1 && x<=x2 ? 1.0 : x>x2 && x<=x3 ? -(x/(x3-x2)) + (x3/(x3-x2)) : 0.0    

let funcionInvTrapezoidal = (x , x0 , x1 , x2 , x3) => x <= x0 ? 1.0 : x>x0 && x<=x1 ? -(x/(x1-x0)) + (x0/(x1-x0)) : x>x1 && x<=x2 ? 0.0 : x>x2 && x<x3 ? (x/(x3-x2)) - (x3/(x3-x2)) : 1.0


//----------------------------------------------------------------
//Operadores

//operador AND 
let OperadorAND = ( a , b ) => Math.min( a , b )

//operador OR 
let OperadorOR = ( a , b ) => Math.max( a , b )

//operador NOT
let OperadorNOT = a => 1.0 - a

//----------------------------------------------------------------

export{funcionBool , funcionInvBool , funcionGrado , funcionInvGrado , funcionTriangulo , funcionInvTriangulo , funcionTrapezoidal , funcionInvTrapezoidal , OperadorAND , OperadorOR ,OperadorNOT}