// PHPadventure — banco de perguntas
// Cada pergunta tem: question, options[4], correct (índice), curiosity (explicação)

const TOPICS = [
  { id: "mvc", label: "MVC", icon: "🗺️" },
  { id: "frameworks", label: "Frameworks", icon: "🧰" },
  { id: "migrations", label: "Migrations", icon: "🪵" },
  { id: "models", label: "Models", icon: "🌾" },
  { id: "eloquent", label: "ORM Eloquent", icon: "🐘" },
  { id: "seeders", label: "Seeders & Factories", icon: "🌱" },
  { id: "controllers", label: "Controllers", icon: "🎣" },
  { id: "blade", label: "Views & Blade", icon: "🏡" },
];

const QUESTIONS = {
  mvc: [
    {
      question: "Cliente-servidor e MVC representam o mesmo conceito?",
      options: [
        "Sim, os dois termos são sinônimos",
        "Não: cliente-servidor trata de localização e comunicação; MVC trata da organização das responsabilidades",
        "Cliente-servidor é uma variação do padrão MVC",
        "MVC define como o navegador se comunica com o servidor",
      ],
      correct: 1,
      curiosity: "Cliente-servidor explica como cliente e servidor se comunicam. MVC organiza a aplicação em Model, View e Controller. São conceitos diferentes e podem ser usados juntos.",
    },
    {
      question: "Numa biblioteca, quem calcula a multa por atraso, quem recebe a solicitação e quem mostra o resultado?",
      options: [
        "O Model calcula a multa, o Controller recebe e coordena a solicitação e a View apresenta o resultado",
        "A View calcula a multa, o Model coordena e o Controller apresenta",
        "O Controller calcula a multa e o Model apresenta o resultado",
        "Todos os três calculam a multa juntos",
      ],
      correct: 0,
      curiosity: "O Model concentra dados e regras; o Controller coordena a requisição; e a View apresenta o resultado ao usuário.",
    },
    {
      question: "O MVC garante, sozinho, um código perfeito e livre de manutenção?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "MVC ajuda a separar responsabilidades, mas não garante sozinho código perfeito nem elimina manutenção, testes ou organização.",
    },
    {
      question: "Para existir uma arquitetura em camadas, cada camada precisa estar num servidor diferente?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "Camadas são uma divisão lógica. Não é obrigatório que cada camada fique em um servidor diferente, mesmo que todas executem juntas.",
    },
    {
      question: "Qual o fluxo correto do MVC para listar livros?",
      options: [
        "Navegador → Controller → Model → Controller → View → navegador",
        "Navegador → Model → View → Controller → navegador",
        "Navegador → View → Model → Controller → navegador",
        "Navegador → Controller → View → Model → navegador",
      ],
      correct: 0,
      curiosity: "O navegador solicita; o Controller coordena; o Model busca os dados; o Controller os encaminha; a View apresenta; e o navegador recebe o HTML.",
    },
    {
      question: "O que é o MVC?",
      options: [
        "Um padrão que separa apresentação, controle das interações e dados e regras da aplicação",
        "Um protocolo de comunicação entre cliente e servidor",
        "Uma biblioteca de funções do PHP",
        "Um tipo de banco de dados relacional",
      ],
      correct: 0,
      curiosity: "Model representa dados e regras, View cuida da apresentação e Controller coordena interações e solicitações.",
    },
    {
      question: "Como o Laravel consegue servir de back-end para Web e mobile ao mesmo tempo?",
      options: [
        "As interfaces podem compartilhar dados e regras do back-end, usando a API como contrato de comunicação",
        "Cada interface precisa de um back-end totalmente separado",
        "O Laravel gera automaticamente um app mobile nativo",
        "O MySQL se conecta direto ao aplicativo mobile, sem back-end",
      ],
      correct: 0,
      curiosity: "Uma API permite que diferentes clientes consumam a mesma lógica e os mesmos dados do back-end.",
    },
    {
      question: "Qual é o papel do Controller no Laravel?",
      options: [
        "Receber os dados da requisição, coordenar a operação e devolver uma resposta adequada",
        "Armazenar diretamente os dados no banco, sem usar Models",
        "Definir a estrutura das tabelas do banco de dados",
        "Renderizar o HTML final enviado ao navegador",
      ],
      correct: 0,
      curiosity: "Controller coordena o fluxo; não deve ser confundido com migration, View ou banco de dados.",
    },
  ],

  frameworks: [
    {
      question: "Qual o benefício de um framework consolidado com convenções, como o Laravel?",
      options: [
        "Os integrantes conseguem localizar componentes com mais facilidade e reutilizar soluções para problemas comuns",
        "Ele elimina totalmente a necessidade de testes",
        "Ele impede qualquer erro de programação",
        "Ele obriga o uso de apenas uma linguagem para sempre",
      ],
      correct: 0,
      curiosity: "Convenções padronizam a estrutura e facilitam manutenção, colaboração e produtividade.",
    },
    {
      question: "Ao usar o Laravel, a aplicação deixa de ser programada em PHP?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "Laravel é um framework de PHP; ele fornece estrutura, ferramentas e convenções, mas não substitui a linguagem.",
    },
    {
      question: "Qual a diferença entre biblioteca e framework?",
      options: [
        "Nosso código normalmente chama a biblioteca, enquanto o framework também controla parte do fluxo e chama nosso código",
        "Biblioteca e framework são exatamente a mesma coisa",
        "O framework só pode ser chamado pela biblioteca",
        "Bibliotecas sempre controlam o fluxo da aplicação",
      ],
      correct: 0,
      curiosity: "Bibliotecas são chamadas pela aplicação quando necessário. Frameworks participam mais diretamente do fluxo da aplicação — isso é chamado de inversão de controle.",
    },
  ],

  migrations: [
    {
      question: "Como criar uma migration para adicionar a coluna isbn à tabela books?",
      options: [
        "php artisan make:migration add_isbn_to_books_table --table=books",
        "php artisan make:model add_isbn_to_books_table",
        "php artisan migrate add_isbn_to_books_table",
        "php artisan make:column isbn --table=books",
      ],
      correct: 0,
      curiosity: "make:migration cria o arquivo. --table=books indica que a migration altera uma tabela existente.",
    },
    {
      question: "Como tornar a coluna isbn opcional numa migration?",
      options: [
        "$table->string('isbn')->nullable();",
        "$table->string('isbn')->required();",
        "$table->nullable('isbn');",
        "$table->string('isbn')->unique();",
      ],
      correct: 0,
      curiosity: "Schema::table altera a tabela existente; string() cria o texto e nullable() permite ausência de valor.",
    },
    {
      question: "O que faz foreignId('category_id')->constrained() numa migration?",
      options: [
        "Cria category_id e a associa à coluna id da tabela categories",
        "Cria apenas um índice, sem nenhuma chave estrangeira",
        "Remove a coluna category_id da tabela",
        "Associa category_id à tabela books, e não a categories",
      ],
      correct: 0,
      curiosity: "Pelas convenções do Laravel, constrained() cria a chave estrangeira para categories.id automaticamente.",
    },
    {
      question: "Qual a relação entre migration, tabela e Model?",
      options: [
        "A migration cria ou altera books, a tabela armazena os livros e o Model Book manipula os registros",
        "O Model cria a tabela toda vez que a aplicação inicia",
        "A tabela gera a migration automaticamente",
        "Migration e Model são exatamente a mesma coisa",
      ],
      correct: 0,
      curiosity: "Migration define estrutura; tabela guarda dados; Model representa a entidade e permite trabalhar com seus registros.",
    },
    {
      question: "Quais comandos usar para aplicar, checar o estado e desfazer migrations?",
      options: [
        "php artisan migrate / migrate:status / migrate:rollback",
        "php artisan db:seed / migrate:fresh / migrate:reset",
        "php artisan make:migration / serve / tinker",
        "php artisan migrate:install (apenas esse)",
      ],
      correct: 0,
      curiosity: "migrate aplica as pendentes; migrate:status mostra o estado; migrate:rollback desfaz o último lote.",
    },
    {
      question: "O comando migrate:fresh --seed preserva os dados que já existiam?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "migrate:fresh apaga todas as tabelas, recria a estrutura e depois executa os seeders. Não preserva dados existentes.",
    },
  ],

  models: [
    {
      question: "O Model é apenas outro nome para uma tabela do banco?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "O Model representa dados e comportamentos da entidade e pode conter relacionamentos, transformações, cálculos e regras. Ele não é simplesmente uma tabela.",
    },
    {
      question: "Como representar a relação 1:1 entre Book e BookDetail?",
      options: [
        "Book usa hasOne(), BookDetail usa belongsTo(), e book_id recebe unique()",
        "Book usa belongsToMany() e BookDetail usa hasMany()",
        "Ambos usam hasMany() entre si",
        "book_id não precisa de nenhuma restrição especial",
      ],
      correct: 0,
      curiosity: "Como book_id está em book_details e um livro pode ter no máximo um detalhe, unique() impede duplicação do mesmo livro.",
    },
    {
      question: "Num relacionamento um-para-muitos, a chave estrangeira normalmente fica no lado 'muitos' (ex: author_id em books)?",
      options: ["Verdadeiro", "Falso"],
      correct: 0,
      curiosity: "Em um relacionamento um-para-muitos, a chave estrangeira normalmente fica no lado muitos. Assim, vários books podem apontar para um author.",
    },
    {
      question: "Para que serve o atributo $fillable no Model?",
      options: [
        "Autorizar esses atributos a serem preenchidos em conjunto, como em Book::create()",
        "Criar automaticamente as colunas da tabela",
        "Validar o formato dos dados enviados",
        "Definir quais atributos aparecem na View",
      ],
      correct: 0,
      curiosity: "Fillable controla mass assignment. Ele não cria colunas, não valida valores e não substitui autorização.",
    },
    {
      question: "Os Models podem conter relacionamentos, transformações, cálculos e regras relacionadas à entidade?",
      options: ["Verdadeiro", "Falso"],
      correct: 0,
      curiosity: "Sim — Models podem conter relacionamentos, transformações, cálculos e regras relacionadas à entidade.",
    },
    {
      question: "Como criar o Model Book no Laravel?",
      options: [
        "php artisan make:model Book",
        "php artisan make:table Book",
        "php artisan create:model Book",
        "php artisan model:new Book",
      ],
      correct: 0,
      curiosity: "Pela convenção, um Model singular Book se relaciona à tabela plural books (app/Models/Book.php).",
    },
    {
      question: "Como representar 'um Author tem vários Books'?",
      options: [
        "A chave author_id fica em books; Author usa hasMany() e Book usa belongsTo()",
        "A chave book_id fica em authors; Author usa belongsTo()",
        "Author e Book usam belongsToMany() entre si",
        "Não é necessária nenhuma chave estrangeira",
      ],
      correct: 0,
      curiosity: "Author é o lado um; Book é o lado muitos. A foreign key fica em books.",
    },
    {
      question: "Declarar hasMany()/belongsTo() no Model já cria a coluna e a restrição da foreign key no banco?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "belongsTo() e hasMany() configuram o relacionamento no código. A coluna e a restrição da foreign key precisam ser criadas por migration.",
    },
    {
      question: "$fillable substitui a necessidade de validação dos dados?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "Fillable controla mass assignment. Validação deve continuar sendo feita com validate(), Form Requests ou mecanismo equivalente.",
    },
    {
      question: "O que fazem create(), save() e delete() no Eloquent?",
      options: [
        "create() insere e devolve o Model criado, save() pode inserir ou atualizar e delete() remove o registro representado",
        "create() apenas busca um registro existente",
        "save() sempre cria um novo registro, nunca atualiza",
        "delete() apaga a tabela inteira",
      ],
      correct: 0,
      curiosity: "create() persiste um novo registro; save() persiste novo ou existente; delete() remove o registro.",
    },
    {
      question: "Qual a diferença entre $book->categories e $book->categories()?",
      options: [
        "A propriedade devolve a coleção relacionada; o método devolve um objeto para consultar ou modificar a relação",
        "Não há nenhuma diferença entre os dois",
        "$book->categories() sempre apaga a relação",
        "$book->categories sempre executa uma nova consulta a cada uso",
      ],
      correct: 0,
      curiosity: "A propriedade acessa os dados relacionados. O método retorna o relacionamento, permitindo filtros e operações como where, attach e detach.",
    },
  ],

  eloquent: [
    {
      question: "Como salvar campos extras (featured, position) na tabela pivot de uma relação N:N?",
      options: [
        "Passar os valores para attach() e configurar withPivot('featured','position') no relacionamento",
        "Salvar esses campos diretamente na tabela categories",
        "Usar apenas fillable no Model Category",
        "Esses campos não podem ser salvos na pivot",
      ],
      correct: 0,
      curiosity: "featured e position pertencem ao vínculo livro-categoria. attach() pode gravá-los na pivot e withPivot() permite acessá-los.",
    },
    {
      question: "Como representar a relação muitos-para-muitos entre Book e Category?",
      options: [
        "Uma tabela pivot, como book_category, guarda as associações; os dois Models usam belongsToMany()",
        "Adicionando category_id diretamente na tabela books",
        "Usando hasOne() nos dois Models",
        "Não é possível representar N:N no Eloquent",
      ],
      correct: 0,
      curiosity: "A pivot representa os vínculos entre os dois lados do relacionamento N:N.",
    },
    {
      question: "attach() e detach() apagam os registros principais (não apenas os vínculos)?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "attach() cria vínculos na pivot; detach() remove esses vínculos. Eles não apagam os registros principais.",
    },
    {
      question: "Qual a relação entre migration, Model e Eloquent?",
      options: [
        "A migration define a estrutura do banco, o Model representa dados e comportamentos, e o Eloquent liga Models e tabelas",
        "Eloquent substitui completamente a necessidade de Models",
        "Migration e Eloquent são a mesma ferramenta",
        "O Model define a estrutura do banco de dados",
      ],
      correct: 0,
      curiosity: "Eloquent é o ORM do Laravel e permite manipular dados por meio dos Models.",
    },
    {
      question: "Por que $book->title funciona mesmo sem uma propriedade PHP declarada?",
      options: [
        "O Eloquent mantém os valores internamente como atributos fornecidos pela classe base Model",
        "O PHP cria a propriedade automaticamente ao rodar migrate",
        "$book->title é um método mágico sem relação com o banco",
        "Isso só funciona se declararmos public $title na classe",
      ],
      correct: 0,
      curiosity: "A classe Model do Eloquent trata atributos recuperados do banco, permitindo acesso como $book->title sem declarar uma propriedade PHP tradicional.",
    },
    {
      question: "Qual a função de where(), orderBy() e get() numa consulta Eloquent?",
      options: [
        "where() e orderBy() constroem a consulta, enquanto get() a executa e devolve uma coleção",
        "get() constrói a consulta e where() a executa",
        "orderBy() executa a consulta imediatamente",
        "Nenhum desses métodos pode ser combinado",
      ],
      correct: 0,
      curiosity: "where filtra, orderBy ordena e get executa a consulta, retornando uma Collection.",
    },
    {
      question: "Qual a relação entre migration, Model e ORM?",
      options: [
        "A migration define a estrutura, o Model representa a entidade e o ORM manipula os registros pelos Models",
        "O ORM define a estrutura das tabelas",
        "A migration manipula os registros da tabela",
        "Model e ORM são a mesma ferramenta",
      ],
      correct: 0,
      curiosity: "Migration = estrutura; Model = entidade; ORM/Eloquent = mapeamento e manipulação objeto-relacional.",
    },
    {
      question: "Qual a finalidade de um ORM como o Eloquent?",
      options: [
        "Fazer o mapeamento entre tabelas/registros do banco e classes/objetos da aplicação",
        "Substituir totalmente o banco de dados",
        "Gerar HTML para as Views",
        "Controlar as rotas da aplicação",
      ],
      correct: 0,
      curiosity: "ORM significa Object-Relational Mapping. O Eloquent faz esse mapeamento no Laravel.",
    },
    {
      question: "Como buscar livros já carregando author e categories numa única operação eficiente?",
      options: [
        "Book::with(['author', 'categories'])->get()",
        "Book::all()->author()->categories()",
        "Book::find('author', 'categories')",
        "Book::where('author')->get('categories')",
      ],
      correct: 0,
      curiosity: "with() faz eager loading dos relacionamentos e ajuda a evitar o problema N+1 ao listar os livros.",
    },
    {
      question: "Qual a diferença entre find() e findOrFail()?",
      options: [
        "find() devolve um Model ou null; findOrFail() devolve um Model ou lança uma exceção",
        "Os dois sempre lançam uma exceção quando não encontram",
        "find() sempre lança exceção e findOrFail() devolve null",
        "Não há diferença entre os dois métodos",
      ],
      correct: 0,
      curiosity: "find() permite tratar a ausência manualmente; findOrFail() dispara uma exceção quando não encontra.",
    },
    {
      question: "Usar Book::all() é uma boa prática para tabelas com milhares de registros?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "all() tenta carregar todos os registros de uma vez. Para listas grandes, use paginação, como paginate(10).",
    },
    {
      question: "Acessar $author->books dentro de um foreach pode gerar uma consulta extra por autor (problema N+1)?",
      options: ["Verdadeiro", "Falso"],
      correct: 0,
      curiosity: "Pode ocorrer uma consulta para os livros e uma nova consulta para cada autor acessado. Isso é o problema N+1.",
    },
    {
      question: "paginate(10) e withQueryString() ajudam a manter filtros entre páginas de uma listagem?",
      options: ["Verdadeiro", "Falso"],
      correct: 0,
      curiosity: "paginate(10) mostra até 10 registros por página; withQueryString() preserva filtros e parâmetros da URL entre páginas.",
    },
    {
      question: "O que faz sync([1,3,5]) numa relação N:N?",
      options: [
        "Mantém na pivot exatamente essas associações, criando as ausentes e removendo as demais",
        "Apaga todas as categorias da tabela categories",
        "Adiciona os IDs sem nunca remover nenhum vínculo antigo",
        "sync() só funciona em relações 1:1",
      ],
      correct: 0,
      curiosity: "sync sincroniza os vínculos da pivot com a lista informada; não apaga as categorias da tabela categories.",
    },
  ],

  seeders: [
    {
      question: "Qual a diferença entre make(), create() e count(10)->create() numa Factory?",
      options: [
        "make() cria um Model não persistido, create() grava no banco e count(10)->create() insere dez registros",
        "make() sempre grava no banco, create() não",
        "count() define o número de colunas da tabela",
        "Não há diferença entre make() e create()",
      ],
      correct: 0,
      curiosity: "make fica em memória; create salva; count define quantos Models serão criados.",
    },
    {
      question: "Como executar todos os seeders ou apenas um Seeder específico?",
      options: [
        "php artisan db:seed executa o DatabaseSeeder, e --class=LibrarySeeder executa o Seeder específico",
        "php artisan migrate executa os seeders automaticamente",
        "Seeders só podem ser executados manualmente pelo phpMyAdmin",
        "php artisan seed:all é o único comando disponível",
      ],
      correct: 0,
      curiosity: "O DatabaseSeeder normalmente coordena outros seeders. --class permite executar um Seeder específico.",
    },
    {
      question: "Por que usar um Seeder no cenário da biblioteca, em vez de inserir dados manualmente?",
      options: [
        "Porque o Seeder pode coordenar quantidades, ordem e relações, combinando dados fixos e gerados por Factories",
        "Porque o Seeder é a única forma de criar uma tabela",
        "Porque o Seeder substitui completamente as migrations",
        "Seeders não podem usar Factories",
      ],
      correct: 0,
      curiosity: "Um Seeder pode criar categorias, autores, livros, detalhes e vínculos na ordem necessária.",
    },
    {
      question: "firstOrCreate() reutiliza registros existentes, enquanto Factories normalmente criam novos a cada execução?",
      options: ["Verdadeiro", "Falso"],
      correct: 0,
      curiosity: "firstOrCreate reutiliza registros existentes quando encontra correspondência; Factories normalmente criam novos registros em cada execução.",
    },
    {
      question: "fake()->unique() dentro de uma Factory substitui a restrição unique() da migration?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "fake()->unique() evita repetições durante uma geração específica. unique() no banco é a garantia estrutural contra duplicatas.",
    },
    {
      question: "Qual a relação entre migration, Factory e Seeder?",
      options: [
        "A migration define a estrutura, a Factory descreve valores de exemplo e o Seeder coordena a inserção dos dados",
        "A Factory define a estrutura das tabelas",
        "O Seeder substitui a necessidade de Models",
        "Migration e Factory são a mesma coisa",
      ],
      correct: 0,
      curiosity: "Migration cuida da estrutura; Factory gera dados; Seeder organiza a carga de dados.",
    },
    {
      question: "Para que serve a trait HasFactory num Model?",
      options: [
        "Disponibilizar o método estático factory(), sem substituir os relacionamentos e demais configurações",
        "Criar automaticamente a migration da tabela",
        "Substituir por completo o Eloquent",
        "Impedir que o Model seja usado em Seeders",
      ],
      correct: 0,
      curiosity: "Com HasFactory, podemos usar Book::factory()->create() e outros métodos de Factory.",
    },
    {
      question: "O que o método definition() faz numa Factory?",
      options: [
        "Devolve os valores padrão de um registro, podendo usar fake() para gerar dados fictícios",
        "Executa as migrations da tabela",
        "Define as rotas do recurso",
        "Apaga os registros antes de criar novos",
      ],
      correct: 0,
      curiosity: "definition() descreve os atributos que serão usados quando a Factory criar um Model.",
    },
    {
      question: "Num Seeder, o que fazem for(), has() e attach()?",
      options: [
        "for() associa o livro ao autor, has() cria o detalhe relacionado e attach() insere a associação na pivot",
        "Os três métodos fazem exatamente a mesma coisa",
        "attach() cria uma nova tabela no banco",
        "for() e has() só funcionam fora de Seeders",
      ],
      correct: 0,
      curiosity: "for trabalha com o relacionamento pai; has cria relacionados; attach cria vínculo em pivot.",
    },
  ],

  controllers: [
    {
      question: "Route::resource() cria automaticamente as Views e as migrations do recurso?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "Route::resource() registra as rotas CRUD convencionais. Não cria Views nem migrations automaticamente.",
    },
    {
      question: "Como garantir que o ISBN continue único ao atualizar um livro, sem bloquear o próprio registro?",
      options: [
        "Usar Rule::unique('books','isbn')->ignore($book) e atualizar o Model só com os dados validados",
        "Remover totalmente a validação de unique() na atualização",
        "Sempre criar um novo registro em vez de atualizar",
        "Aplicar unique() apenas na View",
      ],
      correct: 0,
      curiosity: "ignore($book) permite que o próprio registro mantenha seu ISBN, mas impede usar o ISBN de outro livro.",
    },
    {
      question: "O route model binding, ao gerar 404 para um registro inexistente, já cuida da autorização de quem pode acessá-lo?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "Binding localiza o Model e pode gerar 404 se ele não existir. Permissões precisam de Policies, Gates ou autorização equivalente.",
    },
    {
      question: "Como criar o BookController e ligar a rota GET /books a ele?",
      options: [
        "php artisan make:controller BookController e Route::get('/books', [BookController::class, 'index'])",
        "php artisan make:model BookController",
        "Route::controller('/books', BookController)",
        "php artisan make:route BookController",
      ],
      correct: 0,
      curiosity: "O comando cria o Controller e a rota direciona GET /books para a action index.",
    },
    {
      question: "Como aplicar um filtro ?title=Laravel apenas quando o parâmetro for enviado?",
      options: [
        "Receber Request $request, ler $request->input('title') e usar filled('title') antes de filtrar",
        "Aplicar o filtro sempre, mesmo sem o parâmetro",
        "Usar apenas $request->all() sem nenhuma verificação",
        "filled() não pode ser usado com input()",
      ],
      correct: 0,
      curiosity: "filled() verifica se há valor e input() recupera o parâmetro. Assim o filtro só é aplicado quando necessário.",
    },
    {
      question: "Quais são formas comuns de resposta de uma action?",
      options: [
        "view() prepara uma View com dados, redirect()->route() direciona o navegador e response()->json() devolve JSON",
        "Toda action deve sempre devolver apenas texto puro",
        "response()->json() só funciona em Models",
        "redirect() só pode ser usado dentro de Migrations",
      ],
      correct: 0,
      curiosity: "São formas diferentes de responder a uma requisição conforme o tipo de cliente e operação.",
    },
    {
      question: "Em show(Book $book) numa rota /books/{book}, o que o Laravel faz automaticamente?",
      options: [
        "Procura o registro correspondente, entrega o Model à action e responde com 404 se não o encontrar",
        "Sempre cria um novo Book, mesmo que o ID não exista",
        "Ignora o parâmetro {book} da URL",
        "Retorna sempre uma lista com todos os livros",
      ],
      correct: 0,
      curiosity: "Isso é o route model binding implícito.",
    },
    {
      question: "Quais actions de um Resource Controller exibem formulários, persistem dados e excluem um registro?",
      options: [
        "create e edit exibem formulários; store e update persistem dados; destroy exclui",
        "index e show fazem exclusão de registros",
        "store exibe formulário e create persiste dados",
        "Um Resource Controller não possui action de exclusão",
      ],
      correct: 0,
      curiosity: "Também: index lista e show exibe um registro específico.",
    },
  ],

  blade: [
    {
      question: "@csrf protege o formulário contra CSRF e @method('PUT') simula métodos que o HTML não envia diretamente?",
      options: ["Verdadeiro", "Falso"],
      correct: 0,
      curiosity: "@csrf protege o formulário contra CSRF. @method('PUT') ou @method('DELETE') permite representar métodos que formulários HTML não enviam diretamente.",
    },
    {
      question: "É uma boa prática fazer consultas e exclusões diretamente dentro de um arquivo Blade?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "Blade deve se concentrar na apresentação. Consultas e alterações devem ser coordenadas fora da View.",
    },
    {
      question: "old() e @error eliminam a necessidade de validação no servidor?",
      options: ["Verdadeiro", "Falso"],
      correct: 1,
      curiosity: "old() recupera entradas anteriores e @error exibe mensagens. Nenhum dos dois substitui a validação no servidor.",
    },
    {
      question: "$books->links('partials.pagination') junto com withQueryString() permite personalizar a paginação mantendo os filtros?",
      options: ["Verdadeiro", "Falso"],
      correct: 0,
      curiosity: "$books->links('partials.pagination') renderiza links usando uma View de paginação; withQueryString() mantém os filtros da URL.",
    },
    {
      question: "O Laravel pode renderizar Blade no servidor e, ao mesmo tempo, oferecer uma API para outros front-ends?",
      options: ["Verdadeiro", "Falso"],
      correct: 0,
      curiosity: "Laravel pode renderizar Blade no servidor e também fornecer APIs para front-ends separados ou aplicativos móveis.",
    },
    {
      question: "Como exibir o título de um livro no Blade escapando caracteres especiais do HTML?",
      options: [
        "Usando {{ $book->title }}, que escapa caracteres especiais do HTML",
        "Usando {!! $book->title !!}, que também escapa o conteúdo",
        "Só é possível exibir dados no Blade com PHP puro",
        "{{ }} nunca escapa nenhum tipo de conteúdo",
      ],
      correct: 0,
      curiosity: "{{ }} faz escaping da saída. {!! !!} renderiza sem escaping e exige conteúdo confiável/sanitizado.",
    },
    {
      question: "O que faz return view('books.index', ['books' => $books])?",
      options: [
        "Renderiza books.index e disponibiliza os dados na variável $books da View",
        "Cria uma nova tabela chamada books.index",
        "Redireciona o navegador para /books/index",
        "Executa uma migration chamada books.index",
      ],
      correct: 0,
      curiosity: "books.index corresponde normalmente a resources/views/books/index.blade.php.",
    },
    {
      question: "O que é o Blade?",
      options: [
        "É o mecanismo de templates do Laravel, processado no servidor para gerar o HTML enviado ao navegador",
        "É o ORM oficial do Laravel",
        "É um comando do Composer para instalar pacotes",
        "É o servidor web usado pelo Laravel",
      ],
      correct: 0,
      curiosity: "Blade oferece diretivas como @if, @foreach, @forelse, @include, @extends e @section.",
    },
    {
      question: "Como montar um formulário de atualização (PUT) de livro usando HTML puro?",
      options: [
        "Usar method='POST', a rota books.update, @csrf e @method('PUT')",
        "Usar method='PUT' diretamente na tag <form>",
        "Formulários HTML não precisam de @csrf para atualizar dados",
        "@method só funciona com o verbo GET",
      ],
      correct: 0,
      curiosity: "HTML envia POST; @method('PUT') informa ao Laravel a intenção de atualização; @csrf protege o formulário.",
    },
    {
      question: "Numa interface de biblioteca: o que pertence ao vínculo livro-categoria e o que apenas liga livro e autor?",
      options: [
        "author_id liga livro e autor; featured e position ficam na pivot; desassociar remove só o vínculo, não a categoria",
        "featured e position ficam na tabela authors",
        "Desassociar uma categoria sempre apaga a categoria do banco",
        "author_id fica salvo na tabela pivot",
      ],
      correct: 0,
      curiosity: "author_id liga livro e autor. featured/position ficam na pivot. detach remove somente o vínculo.",
    },
    {
      question: "Como um layout Blade reserva áreas e uma página preenche esse conteúdo?",
      options: [
        "O layout reserva áreas com @yield; a página usa @extends e preenche com @section",
        "O layout usa @extends e a página usa @yield",
        "@section só pode ser usado uma vez por projeto inteiro",
        "Layouts Blade não podem ser reaproveitados entre páginas",
      ],
      correct: 0,
      curiosity: "O layout define espaços; a página herda o layout e fornece o conteúdo.",
    },
    {
      question: "Como reaproveitar o mesmo formulário nas telas de cadastro e edição, mostrando entradas antigas e erros?",
      options: [
        "Incluir um parcial com @include, usar old() para recuperar entradas e @error para exibir a mensagem",
        "Duplicar o formulário inteiro em cada tela",
        "old() só funciona em telas de cadastro, nunca de edição",
        "@error não pode ser usado dentro de um @include",
      ],
      correct: 0,
      curiosity: "O parcial evita duplicação; old recupera entradas após erro; @error mostra a mensagem de validação.",
    },
    {
      question: "Qual diretiva combina a repetição de uma lista com o tratamento de quando ela está vazia?",
      options: [
        "@forelse, combinado com @empty",
        "@foreach, combinado com @unless",
        "@if, combinado com @while",
        "@include, combinado com @section",
      ],
      correct: 0,
      curiosity: "forelse percorre a coleção e empty define o conteúdo exibido quando não há registros.",
    },
  ],
};
