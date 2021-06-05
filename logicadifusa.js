import * as f from '/membresias.js'

const temperatura = document.getElementById('temperatura')
const olfato = document.getElementById('selectolfato')
const gusto = document.getElementById('selectgusto')
const garganta = document.getElementById('selectgarganta')
const boton = document.getElementById('enviar')
const h2resultado = document.getElementById('resultado')


//funciones con fuzzi
//temperatura
let fuzzTemperatura = t => {
  let tlow = f.funcionTrapezoidal(t,30,35,36,36.5)
  let tnormal = f.funcionTriangulo(t,36,36.7,37.5)
  let thigh = f.funcionTrapezoidal(t,37,37.5,41,50)
  //console.log(`fuzz temp = ${[tlow,tnormal,thigh]}`)
  return [tlow,tnormal,thigh]
}
//------------------
//Olfato
let fuzzOlfato = olfato => {
  return f.funcionBool(olfato,.5)
}
//-------------------------------
//Gusto
let fuzzGusto = gusto => {
  return f.funcionBool(gusto , .5)
}
//-------------------
//Ardor
let fuzzArdor = ardor => {
  return f.funcionBool(ardor , .5)
}
//---------------

//funcion de salida 
let funcsalida = valor => {
  let pasa = f.funcionTrapezoidal(valor,-1,-1.8,2,)
  let sospechoso = f.funcionTrapezoidal()
  let covid = f.funcionTrapezoidal()

  return [pasa , sospechoso , covid]
}

//creacion de la matrix de relacion (Step 3)
// _______________________________________________________________________________________________________________________________________________________________________________________________________________________________________
// |                  ||    baja_Temp        |  normal_Temp         |    alta_Temp         |  si_tiene_olfato        | no_tiene_olfato      | si_tiene_gusto      | no_tiene_gusto         | no_tiene_ardor        | si_tiene_ardor       | 
// |------------------||---------------------|----------------------|----------------------|-------------------------|----------------------|---------------------|------------------------|-----------------------|----------------------|
// | baja_Temp        ||        null         |          null        |          null        |      puede_entrar       |  sospechoso_no_entra | puede_entrar        |  sospechoso_no_entra   | puede_entrar          |  sospechoso_no_entra |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// |  mormal_Temp     ||        null         |          null        |          null        |       puede_entrar      |  sospechoso_no_entra | puede_entrar        |  sospechoso_no_entra   | puede_entrar          |  sospechoso_no_entra |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// |    alta_Temp     ||        null         |        null          |         null         |   sospechoso_no_entra   |   covid_no_entra     | sospechoso_no_entra |  covid_no_entra        | sospechoso_no_entra   | covid_no_entra       |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// |  si_tiene_olfato ||    puede_entrar     |    puede_entrar      |  sospechoso_no_entra |         null            |          null        | puede_entrar        |   sospechoso_no_entra  | puede_entrar          | sospechoso_no_entra  |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | no_tiene_olfato  || sospechoso_no_entra |sospechoso_no_entra   |    covid_no_entra    |         null            |          null        | sospechoso_no_entra |    covid_no_entra      |  sospechoso_no_entra  |    covid_no_entra    |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | si_tiene_gusto   ||    puede_entrar     |    puede_entrar      | sospechoso_no_entra  |       puede_entrar      | sospechoso_no_entra  |          null       |           null         | puede_entrar          | sospechoso_no_entra  |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | no_tiene_gusto   || sospechoso_no_entra |sospechoso_no_entra   |    covid_no_entra    |  sospechoso_no_entra    |    covid_no_entra    |          null       |           null         |  sospechoso_no_entra  |    covid_no_entra    |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | no_tiene_ardor   ||    puede_entrar     |    puede_entrar      | sospechoso_no_entra  |       puede_entrar      | sospechoso_no_entra  | puede_entrar        |   sospechoso_no_entra  |           null        |           null       |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | si_tiene_ardor   || sospechoso_no_entra |sospechoso_no_entra   |    covid_no_entra    |  sospechoso_no_entra    |    covid_no_entra    | sospechoso_no_entra |    covid_no_entra      |           null        |           null       |
// |__________________||_____________________|______________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|



//son 24 reglas 
let reglas = (ardor , perdida_gusto , perdida_olfato , Temperatura) => {
  const limite = 0.5
  let rules = [0.1,0.1,0.1]
  let index = 0
  let baseR = (bardor , bperdida_gusto , bperdida_olfato , bTemperatura) => f.OperadorAND(f.OperadorAND(f.OperadorAND(bardor,bperdida_gusto) , bperdida_olfato) , bTemperatura)
  //reglas temp baja    (>= limite  = 1)      (< limite = 0)      temperatura[0] = baja  temperatura[1] = alta  temperatura[2] = alta
    //regla 1 pasa 000
    if((ardor < limite) && (perdida_gusto < limite) && (perdida_olfato < limite) && Temperatura[0] != 0){
      rules[0] =( baseR(f.OperadorNOT(ardor), f.OperadorNOT(perdida_gusto), f.OperadorNOT(perdida_olfato), Temperatura[0] ))
      index = 1
    }
    // regla 2 pasa 001
    if((ardor < limite) && (perdida_gusto < limite) && (perdida_olfato >= limite) && Temperatura[0] != 0){
      rules[0] =( baseR(f.OperadorNOT(ardor), f.OperadorNOT(perdida_gusto), perdida_olfato, Temperatura[0] ) ) 
      index = 2
    } 
    //regla 3  pasa 010
    if((ardor < limite) && (perdida_gusto >= limite) && (perdida_olfato < limite) && Temperatura[0] != 0){
      rules[0] =( baseR(f.OperadorNOT(ardor), perdida_gusto, f.OperadorNOT(perdida_olfato), Temperatura[0] ) )  
      index = 3
    }
    //regla 4  sospechoso 011
    if((ardor < limite) && (perdida_gusto >= limite) && (perdida_olfato >= limite) && Temperatura[0] != 0){
      rules[1] =( baseR(f.OperadorNOT(ardor), perdida_gusto, perdida_olfato, Temperatura[0] ) ) 
      index = 4
    }
    //regla 5  pasa 100
    if((ardor >= limite) && (perdida_gusto < limite) && (perdida_olfato < limite) && Temperatura[0] != 0){
      rules[0] =( baseR(ardor, f.OperadorNOT(perdida_gusto), f.OperadorNOT(perdida_olfato), Temperatura[0] ) )
      index = 5
    }
    //regla 6  sospechoso 101
    if((ardor >= limite) && (perdida_gusto < limite) && (perdida_olfato >= limite) && Temperatura[0] != 0){
      rules[1] =( baseR(ardor, f.OperadorNOT(perdida_gusto), perdida_olfato, Temperatura[0] ) )
      index = 6
    }
    //regla 7  sospechoso 110
    if((ardor >= limite) && (perdida_gusto >= limite) && (perdida_olfato < limite) && Temperatura[0] != 0){
      rules[1] =( baseR(ardor, perdida_gusto, f.OperadorNOT(perdida_olfato), Temperatura[0] ) )  
      index = 7
    }
    //regla 8  covid 111
    if((ardor >= limite) && (perdida_gusto >= limite) && (perdida_olfato >= limite) && Temperatura[0] != 0){
      rules[2] =( baseR(ardor, perdida_gusto, perdida_olfato, Temperatura[0] ) )  
      index = 8
    }
      
  //reglas temp normal
    //regla 9 pasa 000
    if((ardor < limite) && (perdida_gusto < limite) && (perdida_olfato < limite) && Temperatura[1] != 0){
      rules[0] =( baseR(f.OperadorNOT(ardor), f.OperadorNOT(perdida_gusto), f.OperadorNOT(perdida_olfato), Temperatura[1] ) )
      index = 9
    }
    // regla 10 pasa 001
    if((ardor < limite) && (perdida_gusto < limite) && (perdida_olfato >= limite) && Temperatura[1] != 0){
      rules[0] =( baseR(f.OperadorNOT(ardor), f.OperadorNOT(perdida_gusto), perdida_olfato, Temperatura[1] ) )
      index = 10
    }
    //regla 11  pasa 010
    if((ardor < limite) && (perdida_gusto >= limite) && (perdida_olfato < limite) && Temperatura[1] != 0){
      rules[0] =( baseR(f.OperadorNOT(ardor), perdida_gusto, f.OperadorNOT(perdida_olfato), Temperatura[1] ) )  
      index = 11
    }
    //regla 12  sospechoso 011
    if((ardor < limite) && (perdida_gusto >= limite) && (perdida_olfato >= limite) && Temperatura[1] != 0){
      rules[1] =( baseR(f.OperadorNOT(ardor), perdida_gusto, perdida_olfato, Temperatura[1] ) )
      index = 12
    }  
    //regla 13  pasa 100
    if((ardor >= limite) && (perdida_gusto < limite) && (perdida_olfato < limite) && Temperatura[1] != 0){
      rules[0] =( baseR(ardor, f.OperadorNOT(perdida_gusto), f.OperadorNOT(perdida_olfato), Temperatura[1] ) )
      index = 13
    }
    //regla 14  sospechoso 101
    if((ardor >= limite) && (perdida_gusto < limite) && (perdida_olfato >= limite) && Temperatura[1] != 0){
      rules[1] =( baseR(ardor, f.OperadorNOT(perdida_gusto), perdida_olfato, Temperatura[1] ) )
      index = 14
    }
    //regla 15  sospechoso 110
    if((ardor >= limite) && (perdida_gusto >= limite) && (perdida_olfato < limite) && Temperatura[1] != 0){
      rules[1] =( baseR(ardor, perdida_gusto, f.OperadorNOT(perdida_olfato), Temperatura[1] ) ) 
      index = 15
    } 
    //regla 16  covid 111
    if((ardor >= limite) && (perdida_gusto >= limite) && (perdida_olfato >= limite) && Temperatura[1] != 0){
      rules[2] =( baseR(ardor, perdida_gusto, perdida_olfato, Temperatura[1] ) )  
      index = 16
    }

  //reglas temp alta
    //regla 17 pasa 000
    if((ardor < limite) && (perdida_gusto < limite) && (perdida_olfato < limite) && Temperatura[2] != 0){
      rules[0] =( baseR(f.OperadorNOT(ardor), f.OperadorNOT(perdida_gusto), f.OperadorNOT(perdida_olfato), Temperatura[2] ) )
      index = 17
    }
    // regla 18 sospechoso 001
    if((ardor < limite) && (perdida_gusto < limite) && (perdida_olfato >= limite) && Temperatura[2] != 0){
      rules[1] =( baseR(f.OperadorNOT(ardor), f.OperadorNOT(perdida_gusto), perdida_olfato, Temperatura[2] ) )  
      index = 18
    }
    //regla 19  sospechoso 010
    if((ardor < limite) && (perdida_gusto >= limite) && (perdida_olfato < limite) && Temperatura[2] != 0){
      rules[1] =( baseR(f.OperadorNOT(ardor), perdida_gusto, f.OperadorNOT(perdida_olfato), Temperatura[2] ) ) 
      index = 19
    } 
    //regla 20  covid 011
    if((ardor < limite) && (perdida_gusto >= limite) && (perdida_olfato >= limite) && Temperatura[2] != 0){
      rules[2] =( baseR(f.OperadorNOT(ardor), perdida_gusto, perdida_olfato, Temperatura[2] ) )
      index = 20
    } 
    //regla 21  sospechoso 100
    if((ardor >= limite) && (perdida_gusto < limite) && (perdida_olfato < limite) && Temperatura[2] != 0){
      rules[1] =( baseR(ardor, f.OperadorNOT(perdida_gusto), f.OperadorNOT(perdida_olfato), Temperatura[2] ) )
      index = 21
    }
    //regla 22  covid 101
    if((ardor >= limite) && (perdida_gusto < limite) && (perdida_olfato >= limite) && Temperatura[2] != 0){
      rules[2] =( baseR(ardor, f.OperadorNOT(perdida_gusto), perdida_olfato, Temperatura[2] ) )
      index = 22
    }
    //regla 23  covid 110
    if((ardor >= limite) && (perdida_gusto >= limite) && (perdida_olfato < limite) && Temperatura[2] != 0){
      rules[2] =( baseR(ardor, perdida_gusto, f.OperadorNOT(perdida_olfato), Temperatura[2] ) )  
      index = 23
    }
    //regla 24  covid 111
    if((ardor >= limite) && (perdida_gusto >= limite) && (perdida_olfato >= limite) && Temperatura[2] != 0){
      rules[2] =( baseR(ardor, perdida_gusto, perdida_olfato, Temperatura[2] ) ) 
      index = 24
    }
     
    return [index,rules]
}

//--------------------------------------------------------------

//funcion defuzzy centroide
let defuzzy = salida => {
  let anguloB = Math.atan(2/1)  //radianes
  let anguloalfa = 1/2*Math.PI - anguloB //radianes
  let bmenorc1 = 4-salida[0]/Math.atan(anguloalfa)
  let bmenorc2 = 4-(2*salida[1]/Math.atan(anguloalfa))
  let bmenorc3 = 6-salida[2]/Math.atan(anguloalfa)
  let c1 = 1/2 * salida[0] * (bmenorc1+4)
  let c2 = 1/2 * salida[1] * (bmenorc2+4)
  let c3 = 1/2 * salida[2] * (bmenorc3+6)
  let x1 = 2 
  let x2 = 5 
  let x3 = 9

  return ((c1*x1)+(c2*x2)+(c3*x3))/((1/2)*salida[0]*(bmenorc1+4)+(1/2)*salida[1]*(bmenorc2+4)+(1/2)*salida[2]*(bmenorc3+6))

}

//funcion para convertir a grados
let Agrados = r =>  r*180/Math.PI

//funcion para convertir a radianes
let Aradianes = g => g*Math.PI/180




//boton enviar
boton.addEventListener("click", () => {
  //condicion para verificar que introducen una temperatura 
  if(temperatura.value != ""){
    //imprimimos en consola el resultado de las 
    let valores_fuzz =reglas(fuzzArdor(garganta.options[garganta.selectedIndex].value),fuzzGusto(gusto.options[gusto.selectedIndex].value),fuzzOlfato(olfato.options[olfato.selectedIndex].value),fuzzTemperatura(temperatura.value)) 
    let valores_defuzz = defuzzy(valores_fuzz[1])
    let resultado = valores_defuzz > 0 && valores_defuzz<=3.7 ? "Pasa" : valores_defuzz> 3.7 && valores_defuzz <=6.7 ? "Sospechoso" : valores_defuzz>6.7 && valores_defuzz<=12?"Covid" : "Extraterrestre"
    console.log(`regla N° ${valores_fuzz[0]}`)
    //console.log(valores_defuzz)
    //console.log(`Su diagnostico es : ${resultado}`)
    h2resultado.innerHTML = /*html*/`<h2>Su diagnostico es : ${resultado}</h2>`
    //resultado == "pasa" ? " " : h2resultado.innerHTML +=/*html*/`<p>No pasa</p>`
  }
  else{
    alert("Ingresa una temperatura ")
  }
})


