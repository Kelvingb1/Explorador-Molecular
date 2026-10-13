// Consulta carregada como tabela "ConfigExplorador"; parametro WebBaseURL de texto.
let
    Endereco = Text.Trim(WebBaseURL),
    Valido = (Text.StartsWith(Endereco,"https://") or Text.StartsWith(Endereco,"http://"))
        and not Text.Contains(Endereco,"?") and not Text.Contains(Endereco,"#"),
    Config = if Valido then #table(type table [WebBaseURL=text],{{Endereco}})
        else error "Defina WebBaseURL como URL HTTP(S) do explorador sem consulta ou fragmento."
in Config
