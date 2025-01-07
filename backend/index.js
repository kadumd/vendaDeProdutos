const http = require('http')
const fs = require('fs');
const logados = {}

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

        //admin ====================================================================================================================

        case '/produtosNoAdmin':
            const logge = logados[pedido.socket.remoteAddress]

            if (!logge) {
                resposta.writeHead(400)
                resposta.end(fs.readFileSync('./frontend/view/404.html'))
                return;
            }
            resposta.writeHead(200, { "Content-Type": "text/html" });
            resposta.end(fs.readFileSync('./frontend/view/produtosNoAdmin.html'));
            break

        case '/css/admin/produtosNoAdmin.css':
            resposta.writeHead(200, { "Content-Type": "text/css" });
            resposta.end(fs.readFileSync('./frontend/css/produtosNoAdmin.css'));
            break

        //login ====================================================================================================================

        case '/login.html':
            resposta.writeHead(200, { "Content-Type": "text/html" });
            resposta.end(fs.readFileSync('./frontend/view/login.html'));
            break

        //404 ======================================================================================================================

        case '/frontend/view/404.html':
            resposta.writeHead(200, { "Content-Type": "text/html" });
            resposta.end(fs.readFileSync('./frontend/view/404.html'));
            break

        // execucoes no servidor "json" ============================================================================================

        case '/enviarOsDadosDoProduto':
            const logge1 = logados[pedido.socket.remoteAddress]

            if (!logge1) {
                resposta.writeHead(400)
                resposta.end(fs.readFileSync('./frontend/view/404.html'))
                return;
            }
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
            const logge2 = logados[pedido.socket.remoteAddress]

            if (!logge2) {
                resposta.writeHead(400)
                resposta.end(fs.readFileSync('./frontend/view/404.html'))
                return;
            }
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
            const logge3 = logados[pedido.socket.remoteAddress]

            if (!logge3) {
                resposta.writeHead(400)
                resposta.end(fs.readFileSync('./frontend/view/404.html'))
                return;
            }
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
            const logge4 = logados[pedido.socket.remoteAddress]

            if (!logge4) {
                resposta.writeHead(400)
                resposta.end(fs.readFileSync('./frontend/view/404.html'))
                return;
            }
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

        // dados tipo GET ==========================================================================================================

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