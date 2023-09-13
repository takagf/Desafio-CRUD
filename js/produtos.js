const URL = 'http://localhost:3400/produtos';
let modoEdicao = false;

let listaProdutos = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaProduto = document.querySelector('body>div');
let modalProduto = new bootstrap.Modal(document.getElementById("modal-produto"), {});
let tituloModal = document.querySelector('h4.modal-title');

let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');
let sair = document.getElementById('btn-sair');

sair.addEventListener('click', ()=>{
    location.href = "homepage.html";
})

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    valor: document.getElementById('valor'),
    quantidadeEstoque: document.getElementById('quantidadeEstoque'),
}

btnAdicionar.addEventListener('click', () =>{
    modoEdicao = false;
    tituloModal.textContent = "Adicionar Produto"
    limparModalProduto();
    modalProduto.show();
});

btnCancelar.addEventListener('click', () => {
    modalProduto.hide();
});

btnSalvar.addEventListener('click', () => {

    let produto = obterProdutoDoModal();

    if(!produto.nome || !produto.valor || !produto.quantidadeEstoque){
        alert("Campos obrigatórios.")
        return;
    }
    if(modoEdicao == true){
        atualizarProdutoBackEnd(produto)
    }else{
        adicionarProdutoBackEnd(produto);
    }

});

function obterProdutoDoModal(){

    return new Produto({
        id: formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value
    });
}

function obterProdutos() {

    fetch(URL, {
        method: 'GET',
        headers :{
            'Authorization': 'token'
        }
    })
        .then(response => response.json())
        .then(produtos => {
            listaProdutos = produtos;
            popularGrid(produtos);
        })
        .catch()
}

function editarProduto(id){
    modoEdicao = true;
    tituloModal.textContent = "Editar produto"

    let produto = listaProdutos.find(produto => produto.id == id);
    
    atualizarModalProduto(produto);

    modalProduto.show();
}

function excluirProduto(id){

    let produto = listaProdutos.find(c => c.id == id);

    if(confirm("Deseja realmente excluir o produto " + produto.nome + "?")){
        excluirProdutoBackEnd(produto);
        location.reload();
    }
    
}

function atualizarModalProduto(produto){

    formModal.id.value = produto.id;
    formModal.nome.value = produto.nome;
    formModal.valor.value = produto.valor;
    formModal.quantidadeEstoque.value = produto.quantidadeEstoque;
}

function limparModalProduto(){

    formModal.id.value ="";
    formModal.nome.value = "";
    formModal.valor.value = "";
    formModal.quantidadeEstoque.value = "";
}

function criarBloco(produto) {
    let divP = document.createElement('div');
    let divNome = document.createElement('h5');
    let divValor = document.createElement('h5');
    let divQuantiEstoque = document.createElement('h5');

    divP.innerHTML = `<div class="col mb-5">
                        <div>
                        <div class="card h-100">
                        <img class="card-img-top" src="css/image.svg" alt="...">
                        <div class="card-body p-4">
                        <div class="text-center">
                        <h5>${divNome.textContent = produto.nome}</h5>
                        <h5>R$${divValor.textContent = produto.valor}</h5>
                        <h5>Estoque: ${divQuantiEstoque.textContent = produto.quantidadeEstoque}</h5>
                        <button onclick="editarProduto(${produto.id})" id="btn-edit" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#modal-produto">
                        <span class="material-symbols-outlined">
                        edit
                        </span>
                         </button>
                         <button onclick="excluirProduto(${produto.id})" id="btn-exc" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#modal-produto">
                         <span class="material-symbols-outlined">
                         delete
                         </span>
                         </button>
                        </div></div></div></div></div>`
    document.getElementById("teste").appendChild(divP);
}

function popularGrid(produtos) {

    tabelaProduto.textContent = "";
    produtos.forEach(produto => {
        criarBloco(produto);
    });

}

function adicionarProdutoBackEnd(produto){

    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token'
        },
        body : JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {

        let novoProduto = new Produto(response);
        listaProdutos.push(novoProduto);

        popularGrid(listaProdutos)

        modalProduto.hide();
        location.reload();
    })
    .catch(error => {
        console.log(error)
    })
}

function atualizarProdutoBackEnd(produto){

    fetch(`${URL}/${produto.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token'
        },
        body : JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(() => {
        atualizarProdutoNaLista(produto, false);
        modalProduto.hide();
        location.reload();
    })
    .catch(error => {
        console.log(error)
    })
}

function excluirProdutoBackEnd(produto){

    fetch(`${URL}/${produto.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token'
        }
    })
    .then(response => response.json())
    .then(() => {
        atualizarProdutoNaLista(produto, true);
        alert("Cliente Excluído com sucesso!");
        modalProduto.hide();

    })
    .catch(error => {
        console.log(error)
    })
}

function atualizarProdutoNaLista(produto, removerProduto){

    let indice = listaProdutos.findIndex((p) => p.id == produto.id);

    if(removerProduto == true){ 
        listaProdutos.splice(indice, 1)
    }else{
        listaProdutos.splice(indice, 1, produto);
    }

    popularGrid(listaProdutos);
}

obterProdutos();