// ===============================
// INICIALIZAÇÃO
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    configurarMenu();
    configurarBotaoHome();
    carregarCarrinho();
    atualizarCamposEntrega();
    atualizarPrecoMonte();
    permitirApenasUmaOpcaoPorProduto();
    atualizarContadorCarrinho();
});

function permitirApenasUmaOpcaoPorProduto() {
    const produtos = document.querySelectorAll(".produto-item");

    produtos.forEach(produto => {
        const opcoes = produto.querySelectorAll(".tamanhos input[type='checkbox']");

        opcoes.forEach(opcao => {
            opcao.addEventListener("change", function () {
                if (this.checked) {
                    opcoes.forEach(outraOpcao => {
                        if (outraOpcao !== this) {
                            outraOpcao.checked = false;
                        }
                    });
                }
            });
        });
    });
}
// ===============================
// MENU
// ===============================

function configurarMenu() {
    const secoes = {
        "btn-acai": "cardapio-acai",
        "btn-bebidas": "cardapio-bebidas",
        "btn-salgados": "cardapio-salgados"
    };

    Object.keys(secoes).forEach(btnId => {
        const botao = document.getElementById(btnId);
        const secao = document.getElementById(secoes[btnId]);

        if (botao && secao) {
            botao.addEventListener("click", () => {
                secao.scrollIntoView({ behavior: "smooth" });
            });
        }
    });
}

// ===============================
// BOTÃO VER CARDÁPIO
// ===============================

function configurarBotaoHome() {
    const btnVerCardapio = document.getElementById("btn-ver-cardapio");
    const cardapioAcai = document.getElementById("cardapio-acai");

    if (btnVerCardapio && cardapioAcai) {
        btnVerCardapio.addEventListener("click", () => {
            cardapioAcai.scrollIntoView({ behavior: "smooth" });
        });
    }
}

// ===============================
// LOCAL STORAGE
// ===============================

function pegarCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarContadorCarrinho() {
    const contador = document.getElementById("contador-carrinho");

    if (!contador) return;

    const carrinho = pegarCarrinho();

    let quantidade = 0;

    carrinho.forEach(item => {
        quantidade += item.quantidade;
    });

    contador.textContent = quantidade;
}

// ===============================
// ADICIONAR PRODUTO NORMAL
// ===============================


function adicionarCarrinho(botao) {
    const card = botao.closest(".produto-item");

    if (!card) return;

    const selecionado = card.querySelector(
        ".tamanhos input:checked"
    );

    if (!selecionado) {
        alert("Selecione uma opção!");
        return;
    }

    const descricao = selecionado.value;

    // Identifica o preço informado no produto
    const match = descricao.match(/R\$\s*(\d+(?:[.,]\d{1,2})?)/);

    if (!match) {
        alert("Erro ao identificar o preço.");
        return;
    }

    const preco = parseFloat(
        match[1].replace(",", ".")
    );

    const carrinho = pegarCarrinho();

    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item =>
        item.descricao === descricao &&
        item.preco === preco
    );

    if (produtoExistente) {
        // Produto existente: aumenta a quantidade
        produtoExistente.quantidade += 1;
    } else {
        // Produto novo: adiciona ao carrinho
        carrinho.push({
            descricao: descricao,
            preco: preco,
            quantidade: 1
        });
    }

    salvarCarrinho(carrinho);
    atualizarContadorCarrinho();

    alert("✅ Item adicionado ao carrinho!");

    selecionado.checked = false;
}


// ===============================
// MONTE SEU AÇAÍ
// ===============================

function toggleMonteAcai() {
    const opcoes = document.getElementById("opcoes-monte-acai");

    if (!opcoes) return;

    if (opcoes.style.display === "block") {
        opcoes.style.display = "none";
    } else {
        opcoes.style.display = "block";
    }
}

function atualizarPrecoMonte() {
    const precoMonte = document.getElementById("preco-monte");

    if (!precoMonte) return;

    const adicionais = document.querySelectorAll(".adicional:checked");
    const coberturas = document.querySelectorAll(".cobertura:checked");

    let total = 10;

    adicionais.forEach(item => {
        total += parseFloat(item.dataset.preco);
    });

    // 1 cobertura grátis.
    // A partir da segunda cobertura, cobra R$ 1,50 cada.
    if (coberturas.length > 1) {
        total += (coberturas.length - 1) * 1.5;
    }

    precoMonte.innerText = total.toFixed(2);
}


document.addEventListener("change", function(e) {
    const opcao = e.target;

    // Limita a escolha de cremes
    if (opcao.classList.contains("creme")) {
        const cremes = document.querySelectorAll(".creme:checked");

        if (cremes.length > 2) {
            opcao.checked = false;
            alert("Você pode escolher no máximo 2 cremes!");
        }
    }

    // Limita os acompanhamentos grátis
    if (opcao.classList.contains("gratis")) {
        const acompanhamentos = document.querySelectorAll(".gratis:checked");

        if (acompanhamentos.length > 3) {
            opcao.checked = false;
            alert("Você pode escolher no máximo 3 acompanhamentos grátis!");
        }
    }

    // Atualiza o preço quando qualquer opção é alterada
    if (
        opcao.classList.contains("creme") ||
        opcao.classList.contains("gratis") ||
        opcao.classList.contains("adicional") ||
        opcao.classList.contains("cobertura")
    ) {
        atualizarPrecoMonte();
    }
});


function adicionarMonteAcai() {
    const cremes = document.querySelectorAll(".creme:checked");
    const gratis = document.querySelectorAll(".gratis:checked");
    const adicionais = document.querySelectorAll(".adicional:checked");
    const coberturas = document.querySelectorAll(".cobertura:checked");

    if (cremes.length === 0) {
        alert("Escolha pelo menos 1 creme!");
        return;
    }

    if (cremes.length > 2) {
        alert("Você pode escolher no máximo 2 cremes!");
        return;
    }

    if (gratis.length > 3) {
        alert("Você pode escolher no máximo 3 acompanhamentos grátis!");
        return;
    }

    if (coberturas.length === 0) {
        alert("Escolha pelo menos 1 cobertura!");
        return;
    }

    const total = parseFloat(document.getElementById("preco-monte").innerText);

   
let descricao = "🍧 Monte Seu Açaí\n";

descricao += "Cremes: " +
    Array.from(cremes).map(c => c.value).join(", ");

descricao += "\nAcompanhamentos grátis: " +
    (gratis.length > 0
        ? Array.from(gratis).map(g => g.value).join(", ")
        : "Nenhum");

descricao += "\nAdicionais pagos: " +
    (adicionais.length > 0
        ? Array.from(adicionais).map(a => a.value).join(", ")
        : "Nenhum");

descricao += "\nCoberturas: " +
    Array.from(coberturas).map(c => c.value).join(", ");


    let carrinho = pegarCarrinho();

    carrinho.push({
        descricao: descricao,
        preco: total,
        quantidade: 1
    });

    
salvarCarrinho(carrinho);
atualizarContadorCarrinho();

alert("✅ Monte Seu Açaí adicionado ao carrinho!");

// Limpa todas as opções selecionadas
const opcoesSelecionadas = document.querySelectorAll(
    "#opcoes-monte-acai input[type='checkbox']:checked"
);

opcoesSelecionadas.forEach(opcao => {
    opcao.checked = false;
});

// Atualiza o preço para o valor inicial
atualizarPrecoMonte();

// Fecha a área de personalização
document.getElementById("opcoes-monte-acai").style.display = "none";

}

// ===============================
// CARREGAR CARRINHO
// ===============================

function carregarCarrinho() {
    const container = document.getElementById("lista-carrinho");
    const totalSpan = document.getElementById("total");

    if (!container || !totalSpan) return;

    container.innerHTML = "";

    let carrinho = pegarCarrinho();
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        atualizarTotalCarrinho();
        return;
    }

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;

        const div = document.createElement("div");
        div.classList.add("item-carrinho");

        div.innerHTML = `
            <h4 class="descricao-carrinho"></h4>

            <div class="controle-quantidade">
                <button onclick="alterarQuantidade(${index}, -1)">➖</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade(${index}, 1)">➕</button>
            </div>

            <p>Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>

            <button class="btn-remover" onclick="removerItem(${index})">
                Remover
            </button>
        `;
        
    const descricaoElemento = div.querySelector(".descricao-carrinho");

    descricaoElemento.textContent = item.descricao;

        container.appendChild(div);
    });

    atualizarTotalCarrinho();
}

// ===============================
// ALTERAR QUANTIDADE
// ===============================

function alterarQuantidade(index, valor) {
    let carrinho = pegarCarrinho();

    carrinho[index].quantidade += valor;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    salvarCarrinho(carrinho);
    carregarCarrinho();
    atualizarContadorCarrinho();
}

// ===============================
// REMOVER ITEM
// ===============================

function removerItem(index) {
    let carrinho = pegarCarrinho();

    carrinho.splice(index, 1);

    salvarCarrinho(carrinho);
    carregarCarrinho();
    atualizarContadorCarrinho();

}

// ===============================
// LIMPAR CARRINHO
// ===============================



function limparCarrinho() {
    localStorage.removeItem("carrinho");

    carregarCarrinho();
    atualizarContadorCarrinho();
}



// ===============================
// FINALIZAR PEDIDO NO WHATSAPP
// ===============================

function finalizarPedido() {
    let carrinho = pegarCarrinho();

    if (carrinho.length === 0) {
        alert("Carrinho vazio!");
        return;
    }

    const nome = document.getElementById("nome-cliente").value;
    const endereco = document.getElementById("endereco-cliente").value;
    const referencia = document.getElementById("referencia-cliente").value;
    const pagamento = document.getElementById("pagamento-cliente").value;
    const tipoEntrega = document.getElementById("tipo-entrega").value;

    if (nome.trim() === "") {
        alert("Digite seu nome!");
        return;
    }

    
    if (tipoEntrega.trim() === "") {
        alert("Selecione Entrega ou Retirada!");
        return;
    }


    if (tipoEntrega === "Entrega" && endereco.trim() === "") {
        alert("Digite seu endereço!");
        return;
    }

    if (pagamento.trim() === "") {
        alert("Selecione a forma de pagamento!");
        return;
    }

    let taxaEntrega = 0;

    if (tipoEntrega === "Entrega") {
        taxaEntrega = 5;
    }

    let total = 0;

    let mensagem = "🍧 *NOVO PEDIDO - AÇAÍ TOP*\n";
    mensagem += "\n\n";

    mensagem += "👤 *Cliente:* " + nome + "\n";
    mensagem += "🚚 *Tipo do pedido:* " + tipoEntrega + "\n";

    if (tipoEntrega === "Entrega") {
        mensagem += "📍 *Endereço:* " + endereco + "\n";

        if (referencia.trim() !== "") {
            mensagem += "📌 *Referência:* " + referencia + "\n";
        }
    }

    mensagem += "💳 *Pagamento:* " + pagamento + "\n\n";

    mensagem += "🛒 *ITENS DO PEDIDO*\n";
    mensagem += "\n";

    carrinho.forEach((item, index) => {
        let subtotal = item.preco * item.quantidade;

        mensagem += `\n${index + 1}. ${item.descricao}\n`;
        mensagem += `Quantidade: ${item.quantidade}\n`;
        mensagem += `Valor Unitário: R$ ${item.preco.toFixed(2)}\n`;
        mensagem += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;

        total += subtotal;
    });

    total += taxaEntrega;

    mensagem += "\n";
    mensagem += `🚚 *Taxa de Entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
    mensagem += `💰 *TOTAL DO PEDIDO:* R$ ${total.toFixed(2)}\n`;
    mensagem += "\n";
    mensagem += "🙏 Obrigado pela preferência!";


const botaoFinalizar = document.getElementById("btn-finalizar");

if (botaoFinalizar.disabled) return;

botaoFinalizar.disabled = true;

window.open(
    `https://wa.me/5584987228300?text=${encodeURIComponent(mensagem)}`,
    "_blank"
);

setTimeout(() => {
    botaoFinalizar.disabled = false;
}, 3000);
}


// ===============================
// ATUALIZAR TOTAL DO CARRINHO
// ===============================


function atualizarTotalCarrinho() {
    const carrinho = pegarCarrinho();

    const subtotal = carrinho.reduce((soma, item) => {
        return soma + item.preco * item.quantidade;
    }, 0);

    const tipoEntrega = document.getElementById("tipo-entrega");

    if (!tipoEntrega) return;

    const taxa = tipoEntrega.value === "Entrega" && carrinho.length > 0
        ? 5
        : 0;

    const total = subtotal + taxa;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("taxa-entrega").textContent = taxa.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}


function atualizarCamposEntrega() {
    const tipoEntrega = document.getElementById("tipo-entrega");
    const camposEntrega = document.getElementById("campos-entrega");

    if (!tipoEntrega || !camposEntrega) return;

    if (tipoEntrega.value === "Entrega") {
        camposEntrega.style.display = "block";
    } else {
        camposEntrega.style.display = "none";
    }
}
