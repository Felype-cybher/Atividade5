async function buscarInformacoes() {
    const nome = document.getElementById('nome').value.trim();
    const resultado = document.getElementById('resultado');

    if (!nome) {
        resultado.innerText = "Por favor, digite um nome válido.";
        return;
    }

    try {
        resultado.innerText = "Buscando informações...";

        const [idadeRes, generoRes, paisRes] = await Promise.all([
            fetch(`https://api.agify.io?name=${nome}`),
            fetch(`https://api.genderize.io?name=${nome}`),
            fetch(`https://api.nationalize.io?name=${nome}`)
        ]);

        if (!idadeRes.ok || !generoRes.ok || !paisRes.ok)
            throw new Error("Erro ao acessar uma das APIs.");

        const idade = await idadeRes.json();
        const genero = await generoRes.json();
        const pais = await paisRes.json();

        const paisMaisProvavel = pais.country.length > 0
            ? pais.country[0].country_id
            : "desconhecido";

        resultado.innerText = `
  Nome: ${nome}
  Idade estimada: ${idade.age || "não encontrada"}
  Gênero estimado: ${genero.gender || "não identificado"}
  País provável: ${paisMaisProvavel}
`;
    } catch (erro) {
        resultado.innerText = "Erro ao buscar os dados. Tente novamente.";
        console.error("Erro:", erro);
    }
}
