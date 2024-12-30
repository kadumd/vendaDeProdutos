const http = require('http')
const fs = require('fs');
const logados = {}
const { access } = require('fs/promises');

const servidor = http.createServer((pedido, resposta) => {
    console.log(pedido.url)
    switch (pedido.url) {
        case '/':
            resposta.writeHead(200, { "Content-Type": "text/html" });
            resposta.end(fs.readFileSync('./frontend/view/produtosNoSite.html'));
            break

        case '/css/site/produtosNoSite.css':
            resposta.writeHead(200, { "Content-Type": "text/css" });
            resposta.end(fs.readFileSync('./frontend/css/produtosNoSite.css'));
            break

        //admin -------------------------------------------------------

        case '/produtosNoAdmin':
            const logge = logados[pedido.socket.remoteAddress]

            if (!logge) {
                resposta.writeHead(400)
                resposta.end(JSON.stringify('./frontend/view/404.html'))
                return;
            }
            resposta.writeHead(200, { "Content-Type": "text/html" });
            resposta.end(fs.readFileSync('./frontend/view/produtosNoAdmin.html'));
            break

        case '/css/admin/produtosNoAdmin.css':
            resposta.writeHead(200, { "Content-Type": "text/css" });
            resposta.end(fs.readFileSync('./frontend/css/produtosNoAdmin.css'));
            break

        //login -------------------------------------------------------

        case '/login.html':
            resposta.writeHead(200, { "Content-Type": "text/html" });
            resposta.end(fs.readFileSync('./frontend/view/login.html'));
            break


        // execucoes no servidor "json"

        case '/enviarOsDadosDoProduto':
            pedido.on('data', (body) => {
                const envio = JSON.parse(body)
                let dados = JSON.parse(fs.readFileSync('./frontend/src/produtos.json'))
                dados.push(envio)
                fs.writeFileSync('frontend/src/produtos.json', JSON.stringify(dados))

                resposta.writeHead(200, { "Content-Type": "application/json" });
                resposta.end(JSON.stringify('funcionou'));
            })
            break


        case '/usuarioESenha':
            pedido.on('data', (body) => {
                const envio = JSON.parse(body)
                let dados = JSON.parse(fs.readFileSync('./frontend/src/contas.json'))
                console.log(envio)

                let verificacao = dados.find(objeto => {
                    return objeto.usuario === envio.usuario && objeto.senha === envio.senha
                })

                if (verificacao) {
                    resposta.writeHead(200, { "Content-Type": "application/json" });
                    resposta.end(JSON.stringify({ acessos: 'permitido' }));
                    logados[pedido.socket.remoteAddress] = true;
                } else {
                    resposta.writeHead(200, { "Content-Type": "application/json" });
                    resposta.end(JSON.stringify({ acessos: 'negado' }));
                }
            })
            break



        case '/enviarOsDadosDoTexto':
            pedido.on('data', (body) => {
                const envio = JSON.parse(body)
                let dados = JSON.parse(fs.readFileSync('./frontend/src/sobreNos.json'))
                dados.shift()
                dados.push(envio)
                fs.writeFileSync('frontend/src/sobreNos.json', JSON.stringify(dados))

                resposta.writeHead(200, { "Content-Type": "application/json" });
                resposta.end(JSON.stringify('funcionou'));
            })
            break

        case '/enviarMensagem':
            pedido.on('data', (body) => {
                const envio = JSON.parse(body)
                let dados = JSON.parse(fs.readFileSync('./frontend/src/mensagem.json'))
                dados.push(envio)
                fs.writeFileSync('frontend/src/mensagem.json', JSON.stringify(dados))

                resposta.writeHead(200, { "Content-Type": "application/json" });
                resposta.end(JSON.stringify('funcionou'));
            })
            break


        case '/removerProduto':
            pedido.on('data', (body) => {
                const envio = JSON.parse(body)
                let dados = JSON.parse(fs.readFileSync('./frontend/src/produtos.json'))

                let verificacao = dados.find = (objeto => {
                    return objeto.nome == envio
                })

                if (verificacao) {
                    const novoArray = dados.filter(obj => obj.nome !== envio);
                    fs.writeFileSync('frontend/src/produtos.json', JSON.stringify(novoArray))

                    resposta.writeHead(200, { "Content-Type": "application/json" });
                    resposta.end(JSON.stringify('funcionou'));
                }
            })
            break


        case '/removerMensagem':
            pedido.on('data', (body) => {
                const envio = JSON.parse(body)
                let dados = JSON.parse(fs.readFileSync('./frontend/src/mensagem.json'))

                let verificacao = dados.find = (objeto => {
                    return objeto.nome == envio
                })

                if (verificacao) {
                    const novoArray = dados.filter(obj => obj.nome !== envio);
                    fs.writeFileSync('frontend/src/mensagem.json', JSON.stringify(novoArray))

                    resposta.writeHead(200, { "Content-Type": "application/json" });
                    resposta.end(JSON.stringify('funcionou'));
                }
            })
            break



        // dados tipo GET
        case '/bancoProdutos':
            resposta.writeHead(200, { "Content-Type": "application/json" });
            resposta.end(fs.readFileSync('./frontend/src/produtos.json'));
            break

        case '/bancoSobreNos':
            resposta.writeHead(200, { "Content-Type": "application/json" });
            resposta.end(fs.readFileSync('./frontend/src/sobreNos.json'));
            break

        case '/bancoMensagem':
            resposta.writeHead(200, { "Content-Type": "application/json" });
            resposta.end(fs.readFileSync('./frontend/src/mensagem.json'));
            break
    }
})

servidor.listen(3000)