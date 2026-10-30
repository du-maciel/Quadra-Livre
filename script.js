const quadras = [
    {
        id: 1,
        nome: "Arena Centro",
        esporte: "Futebol",
        endereco: "Unidade Centro",
        preco: 120,
        icone: "⚽",
        imagem: "https://gramaiberica.com/wp-content/uploads/2024/03/F11.-SANTA-ANA.-UTEBO.jpg"
    },
    {
        id: 2,
        nome: "Futsal Positivo",
        esporte: "Futsal",
        endereco: "Unidade Norte",
        preco: 90,
        icone: "⚽",
        imagem: "https://i.pinimg.com/originals/f3/71/b9/f371b9e092b84045399719471630431f.jpg"
    },
    {
        id: 3,
        nome: "Vôlei Park",
        esporte: "Vôlei",
        endereco: "Unidade Norte",
        preco: 80,
        icone: "🏐",
        imagem: "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        nome: "Arena Basquete",
        esporte: "Basquete",
        endereco: "Unidade Centro",
        preco: 80,
        icone: "🏀",
        imagem: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80"
    }
];

const horarios = [
    "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00"
];

const CHAVE = "reservasQuadraLivre";

const lista = document.getElementById("lista-quadras");
const seletor = document.getElementById("quadra");
const data = document.getElementById("data");
const caixaHorarios = document.getElementById("horarios");
const horarioEscolhido = document.getElementById("horario-escolhido");
const mensagem = document.getElementById("mensagem");
const formulario = document.getElementById("form-reserva");

function lerReservas() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE) || "[]");
    } catch {
        return [];
    }
}

function salvarReservas(reservas) {
    localStorage.setItem(CHAVE, JSON.stringify(reservas));
}

// Mostrar os cartões com as fotos
function mostrarQuadras(filtro = "Todos") {
    const filtradas = filtro === "Todos"
        ? quadras
        : quadras.filter(q => q.esporte === filtro);

    lista.innerHTML = "";

    filtradas.forEach(q => {
        const card = document.createElement("article");
        card.className = "card";

        const imagem = document.createElement("img");
        imagem.className = "foto-quadra";
        imagem.src = q.imagem;
        imagem.alt = "Foto ilustrativa de " + q.esporte;
        imagem.loading = "lazy";

        // Se a foto não carregar, mostra um emoji.
        imagem.onerror = function () {
            const alternativa = document.createElement("div");
            alternativa.className = "foto-alternativa";
            alternativa.textContent = q.icone;
            imagem.replaceWith(alternativa);
        };

        const conteudo = document.createElement("div");
        conteudo.className = "card-conteudo";

        const titulo = document.createElement("h3");
        titulo.textContent = q.nome;

        const esporte = document.createElement("p");
        esporte.textContent = q.esporte;

        const endereco = document.createElement("p");
        endereco.textContent = "📍 " + q.endereco;

        const preco = document.createElement("p");
        preco.className = "preco";
        preco.textContent =
            "R$ " + q.preco.toFixed(2).replace(".", ",") + "/hora";

        const botao = document.createElement("button");
        botao.className = "botao";
        botao.type = "button";
        botao.textContent = "Ver horários";

        botao.addEventListener("click", () => {
            seletor.value = q.id;
            atualizarHorarios();

            document.getElementById("reservar")
                .scrollIntoView({ behavior: "smooth" });
        });

        conteudo.append(titulo, esporte, endereco, preco, botao);
        card.append(imagem, conteudo);
        lista.appendChild(card);
    });
}

// Preencher o seletor de quadras
function preencherQuadras() {
    seletor.innerHTML = "";

    quadras.forEach(q => {
        const opcao = document.createElement("option");
        opcao.value = q.id;
        opcao.textContent = q.nome + " - " + q.esporte;
        seletor.appendChild(opcao);
    });
}


function atualizarHorarios() {
    const quadraId = Number(seletor.value);
    const dia = data.value;

    horarioEscolhido.value = "";
    mensagem.textContent = "";
    caixaHorarios.innerHTML = "";

    if (!dia) {
        caixaHorarios.textContent = "Escolha uma data primeiro.";
        return;
    }

    const reservas = lerReservas();

    horarios.forEach(horario => {
        const ocupado = reservas.some(r =>
            r.quadraId === quadraId &&
            r.data === dia &&
            r.horario === horario
        );

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "horario";
        botao.textContent = ocupado
            ? horario + " (ocupado)"
            : horario;
        botao.disabled = ocupado;

        botao.addEventListener("click", () => {
            document.querySelectorAll(".horario")
                .forEach(b => b.classList.remove("selecionado"));

            botao.classList.add("selecionado");
            horarioEscolhido.value = horario;
        });

        caixaHorarios.appendChild(botao);
    });
}


formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const dia = data.value;
    const horario = horarioEscolhido.value;
    const quadraId = Number(seletor.value);

    if (!nome || !telefone || !dia || !horario) {
        mensagem.textContent =
            "Preencha os campos e selecione um horário livre.";
        return;
    }

    const hoje = new Date();
    hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
    const dataHoje = hoje.toISOString().split("T")[0];

    if (dia < dataHoje) {
        mensagem.textContent = "Escolha uma data de hoje em diante.";
        return;
    }

    const reservas = lerReservas();

    const ocupado = reservas.some(r =>
        r.quadraId === quadraId &&
        r.data === dia &&
        r.horario === horario
    );

    if (ocupado) {
        mensagem.textContent =
            "Esse horário já está ocupado. Escolha outro.";
        atualizarHorarios();
        return;
    }

    reservas.push({
        id: Date.now().toString(),
        quadraId,
        data: dia,
        horario,
        nome,
        telefone
    });

    salvarReservas(reservas);

    const quadra = quadras.find(q => q.id === quadraId);

    mensagem.textContent =
        "Solicitação de demonstração registrada para " +
        quadra.nome + ", dia " + dia + ", às " + horario +
        ". A empresa não foi notificada.";

    formulario.reset();
    data.value = dataHoje;
    horarioEscolhido.value = "";
    atualizarHorarios();
});


document.querySelectorAll(".filtro").forEach(botao => {
    botao.addEventListener("click", () => {
        document.querySelectorAll(".filtro")
            .forEach(b => b.classList.remove("ativo"));

        botao.classList.add("ativo");
        mostrarQuadras(botao.dataset.esporte);
    });
});


seletor.addEventListener("change", atualizarHorarios);
data.addEventListener("change", atualizarHorarios);


const hoje = new Date();
hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
data.min = hoje.toISOString().split("T")[0];
data.value = data.min;


preencherQuadras();
mostrarQuadras();
atualizarHorarios();
