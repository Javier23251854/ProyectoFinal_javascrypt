function calcular() {

  let n1 = parseFloat(document.getElementById("num1").value);
  let n2 = parseFloat(document.getElementById("num2").value);
  let op = document.getElementById("operacion").value;
  let res = 0;


  if (op === "+") {
    res = n1 + n2;
  } else if (op === "-") {
    res = n1 - n2;
  } else if (op === "*") {
    res = n1 * n2;
  } else if (op === "/") {
    res = n1 / n2;
  }

  document.getElementById("resultado").innerText = "Resultado: " + res;
}