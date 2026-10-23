const enderecosPorEsporte = {
    "Fut7": [
        "Rua Professor Pedro Viriato Parigot de Souza, 5300, Curitiba, Paraná",
        "Rua das Flores, 245 — Centro, Curitiba - PR, CEP 80010-120"
    ],
    "Futsal": [
        "Avenida Brasil, 1380 — Jardim América, São Paulo - SP, CEP 01430-001"
    ],
    "Tênis": [
        "Rua Monte Azul, 408 — Jardim das Oliveiras, Campinas - SP, CEP 13050-400"
    ],
    "Padel": [
        "Travessa do Sol, 29 — Centro, Florianópolis - SC, CEP 88010-500"
    ],
    "Futevôlei": [
        "Avenida dos Pioneiros, 562 — Centro, Londrina - PR, CEP 86010-200"
    ],
    "Beach Tennis": [
        "Rua Bela Vista, 321 — Jardim Europa, Porto Alegre - RS, CEP 90450-100",
        "Rua Professor Pedro Viriato Parigot de Souza, 5300, Curitiba, Paraná"
    ],
    "Vôlei de Praia": [
        "Rua dos Ipês, 87 — Boa Vista, Fazenda Rio Grande - PR, CEP 83820-150"
    ],
    "Basquete": [
        "Rua Professor Pedro Viriato Parigot de Souza, 5300, Curitiba, Paraná",
        "Rua das Acácias, 63 — Santa Felicidade, Curitiba - PR, CEP 82015-180"
    ]
};

function mostrarHorarios(esporte) {
    const area = document.getElementById("area-horarios");
    const titulo = document.getElementById("titulo-esporte");
    const horarios = document.getElementById("horarios");
    const divEnderecos = document.getElementById("lista-enderecos"); // Elemento de endereços

    titulo.textContent = "Horários para " + esporte;
    area.hidden = false;

    // 2. Limpar e preencher a lista de endereços
    divEnderecos.innerHTML = "";
    const locais = enderecosPorEsporte[esporte] || ["Endereço padrão - Rua Principal, 100"];

    locais.forEach(function(endereco) {
        const p = document.createElement("p");
        p.textContent = "📍 " + endereco;
        p.className = "item-endereco";
        divEnderecos.appendChild(p);
    });

    // 3. Sua lógica original dos horários
    const listaHorarios = [
        "08:00", "09:00", "10:00",
        "11:00", "14:00", "15:00",
        "16:00", "17:00", "18:00",
        "19:00", "20:00", "21:00"
    ];

    horarios.innerHTML = "";

    listaHorarios.forEach(function(horario) {
        const botao = document.createElement("button");

        botao.textContent = horario;
        botao.className = "horario";

        botao.onclick = function() {
            alert(
                "Você selecionou " + esporte +
                " às " + horario
            );
        };

        horarios.appendChild(botao);
    });

    area.scrollIntoView({ behavior: "smooth" });
}

