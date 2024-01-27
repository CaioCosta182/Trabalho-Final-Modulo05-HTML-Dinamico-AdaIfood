document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("dark-theme");
  // Verifica se os dados do Passo 1 já foram preenchidos
  const storedName = localStorage.getItem("name");
  const storedEmail = localStorage.getItem("email");
  const storedCep = localStorage.getItem("cep");

  if (storedName && storedEmail && storedCep) {
    document.getElementById("name").value = storedName;
    document.getElementById("email").value = storedEmail;
    document.getElementById("cep").value = storedCep;
  }

  showStep(1); // Exibe o primeiro passo inicialmente

  // Adiciona um ouvinte de eventos ao botão de alternância de tema

  const themeToggleButtons = document.querySelectorAll(".theme-toggle");
  themeToggleButtons.forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });
});

let currentStep = 1;

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-theme");
  body.classList.toggle("light-theme");

  const themeToggleButtons = document.querySelectorAll(".theme-toggle");
  themeToggleButtons.forEach((button) => {
    const currentImagePath = button.src;
    const newImagePath = body.classList.contains("dark-theme")
      ? "assets/images/off.png"
      : "assets/images/on.png";
    button.src = newImagePath;
  });
}
function nextStep() {
  if (validateStep(currentStep)) {
    hideStep(currentStep);
    currentStep++;
    showStep(currentStep);
  }
}
function backStep() {
  if (validateStep(currentStep)) {
    hideStep(currentStep);
    currentStep--;
    showStep(currentStep);
  }
}

function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const cep = document.getElementById("cep").value.trim();

    if (name === "" || email === "" || cep === "") {
      alert("Preencha todos os campos obrigatórios.");
      return false;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("cep", cep);
  }

  return true;
}

function hideStep(step) {
  const stepElement = document.getElementById(`step${step}`);
  if (stepElement) {
    stepElement.style.display = "none";
  }
}

function showStep(step) {
  const stepElement = document.getElementById(`step${step}`);
  if (stepElement) {
    stepElement.style.display = "block";

    if (step === 2) {
      // Adicione lógica para criar os campos do Passo 2
      createStep2Fields();
    } else if (step === 3) {
      // Adicione lógica para criar a tabela do Passo 3
      createStep3Table();
    }
  }
}

function createStep2Fields() {
  const step2Div = document.getElementById("step2");
  step2Div.innerHTML = `
        <input
          class="theme-toggle"
          type="image"
          src="assets/images/on.png"
          onclick="toggleTheme()"
        />
        <h2>Churrascômetro</h2>
        <p>Precisando de uma ajudinha com o churrasco? :) </p>
        <p>Quantas pessoas vão participar?</p>
        <div class="containerCards" id="fieldsContainer"></div>
        <button class="botao" type="button" onclick="nextStep()">Calcular</button>
      `;

  const fields = ["Homens", "Mulheres", "Crianças", "Pessoas que bebem"];

  const fieldsContainer = document.getElementById("fieldsContainer");

  fields.forEach((field) => {
    const label = field.toLowerCase().replace(/\s/g, "");
    fieldsContainer.innerHTML += `
          <div class="inputCards">  
            <label class="labelConvidados" for="${label}">${field}</label>
            <input type="text" id="${label}" min="0" value="0" required></br>
            <div class="containerOperacao">
              <input id="btnSubtracao" class="operacao" type="image" src="assets/images/subtracao.png" onclick="subtraiConvidado('${label}')"/>
              <input id="btnSoma" class="operacao" type="image" src="assets/images/soma.png" onclick="adicionaConvidado('${label}')"/>
            </div>
          </div>
        `;
  });
}

function adicionaConvidado(label) {
  const inputField = document.getElementById(label);
  if (inputField) {
    inputField.value = parseInt(inputField.value, 10) + 1;
  }
}

function subtraiConvidado(label) {
  const inputField = document.getElementById(label);
  if (inputField) {
    const currentValue = parseInt(inputField.value, 10);
    if (currentValue > 0) {
      inputField.value = currentValue - 1;
    }
  }
}

function createStep3Table() {
  const step3Div = document.getElementById("step3");
  if (step3Div) {
    step3Div.innerHTML = `
    <input
    class="theme-toggle"
    type="image"
    src="assets/images/on.png"
    onclick="toggleTheme()"
    />
        <h2>Churrascômetro</h2></br>
        <p>Confira a lista de compras para o seu churrasco.</p></br>`;

    // Dados para cálculo
    const dados = {
      homens: parseInt(document.getElementById("homens").value, 10),
      mulheres: parseInt(document.getElementById("mulheres").value, 10),
      criancas: parseInt(document.getElementById("crianças").value, 10),
      pessoasBebem: parseInt(
        document.getElementById("pessoasquebebem").value,
        10
      ),
      pessoas:
        parseInt(document.getElementById("homens").value) +
        parseInt(document.getElementById("mulheres").value) +
        parseInt(document.getElementById("crianças").value),
    };

    // Tabela de referência
    const tabelaReferencia = {
      carne: { homens: 0.4, mulheres: 0.32, criancas: 0.2 },
      paodealho: { homens: 2, mulheres: 2, criancas: 1 },
      carvao: { pessoas: 1 },
      sal: { pessoas: 0.04 },
      gelo: { pessoas: 5 },
      refrigerante: { pessoas: 1 },
      agua: { pessoas: 0.25 },
      cerveja: { pessoasBebem: 3 },
    };

    // Calcula quantidade de itens
    const resultado = calcularQuantidades(dados, tabelaReferencia);

    const consumoTotalCarne =
      resultado.carne.homens +
      resultado.carne.mulheres +
      resultado.carne.criancas;

    const consumoTotalPao =
      resultado.paodealho.homens +
      resultado.paodealho.mulheres +
      resultado.paodealho.criancas;

    const consumoRefri =
      resultado.refrigerante.pessoas -
      parseInt(document.getElementById("pessoasquebebem").value, 10);

    const consumoAgua = resultado.agua.pessoas;

    const consumoCerveja = resultado.cerveja.pessoasBebem;

    const consumoCarvao = resultado.carvao.pessoas;

    const consumoSal = resultado.sal.pessoas;

    const consumoGelo = resultado.gelo.pessoas;

    // Cria a tabela principal
    const tabelaHTML = `
   
    <p id="totalConvidados"> ${dados.pessoas} Convidados</p>
    <p>${dados.homens} Homens  ${dados.mulheres} Mulheres  ${dados.criancas} Crianças</p>
     
    `;

    step3Div.innerHTML += tabelaHTML;

    // Adiciona a tabela com o consumo total de carne
    const tabelaCarneHTML = `
     <table class="containerTabela">
       <tr>
         <th>ITEM</th>
         <td>QUANTIDADE</td>
       </tr>
       <tr>
         <td>Carne</td>
         <td>${consumoTotalCarne.toFixed(2)} Kg</td>
       </tr>
     </table>
   `;

    step3Div.innerHTML += tabelaCarneHTML;

    // Adiciona a tabela com o consumo total de pao
    const tabelaPaoHTML = `
 <table class="containerTabela">
   
   <tr>
     <td>Pão de alho</td>
     <td>${consumoTotalPao.toFixed(0)} Unidades</td>
   </tr>
 </table>
`;

    step3Div.innerHTML += tabelaPaoHTML;

    const tabelaRefriHTML = `
    <table class="containerTabela">
      
      <tr>
        <td>Refrigerante</td>
        <td>${consumoRefri.toFixed(0)} Garrafas de 2 L</td>
      </tr>
    </table>
   `;

    step3Div.innerHTML += tabelaRefriHTML;

    const tabelaAguaHTML = `
    <table class="containerTabela">
      
      <tr>
        <td>Água</td>
        <td>${consumoAgua.toFixed(0)} Garrafas de 1 L</td>
      </tr>
    </table>
   `;

    step3Div.innerHTML += tabelaAguaHTML;

    const tabelaCervejaHTML = `
    <table class="containerTabela">
      
      <tr>
        <td>Cerveja</td>
        <td>${consumoCerveja.toFixed(0)} Garrafas de 600 ml</td>
      </tr>
    </table>
   `;

    step3Div.innerHTML += tabelaCervejaHTML;

    const tabelaCarvaoHTML = `
    <table class="containerTabela">
      
      <tr>
        <td>Carvão</td>
        <td>${consumoCarvao.toFixed(0)} Kg</td>
      </tr>
    </table>
   `;

    step3Div.innerHTML += tabelaCarvaoHTML;

    const tabelaSalHTML = `
    <table class="containerTabela">
      
      <tr>
        <td>Sal</td>
        <td>${consumoSal.toFixed(3)} Kg</td>
      </tr>
    </table>
   `;

    step3Div.innerHTML += tabelaSalHTML;

    const tabelaGeloHTML = `
    <table class="containerTabela">
      
      <tr>
        <td>Gelo</td>
        <td>${consumoGelo.toFixed(0)} Gelo</td>
      </tr>
    </table>
   `;

    step3Div.innerHTML += tabelaGeloHTML;

    step3Div.innerHTML += `<button class="botao" type="button" onclick="backStep()">Novo Cálculo</button>`;
  }
}

// A função calcularQuantidades deve aparecer apenas uma vez no código
function calcularQuantidades(dados, tabelaReferencia) {
  const resultado = {};

  for (const item in tabelaReferencia) {
    if (typeof tabelaReferencia[item] === "object") {
      resultado[item] = {};
      for (const subItem in tabelaReferencia[item]) {
        const valorSubItem = dados[subItem] || 0;
        const valorReferencia = tabelaReferencia[item][subItem] || 0;
        resultado[item][subItem] = valorSubItem * valorReferencia;
      }
    } else {
      const valorItem = dados[item] || 0;

      // Tratamento especial para itens que têm subitens
      if (typeof tabelaReferencia[item] === "object") {
        resultado[item] = {};
        for (const subItem in tabelaReferencia[item]) {
          resultado[item][subItem] =
            valorItem * tabelaReferencia[item][subItem];
        }
      } else {
        resultado[item] = valorItem * tabelaReferencia[item];
      }
    }
  }

  return resultado;
}

function getElementValue(elementId) {
  const element = document.getElementById(elementId);
  return element ? element.value : null;
}
