// PHPadventure — banco de perguntas
// Cada pergunta tem: question, options[4], correct (índice), curiosity (explicação)

const TOPICS = [
  { id: "mvc", label: "MVC", icon: "🗺️", video: "jyTNhT67ZyY" },
  { id: "frameworks", label: "Frameworks", icon: "🧰", video: "2zqzzTnfa0E" },
  { id: "migrations", label: "Migrations", icon: "🪵", video: "HRw1Dcxxu2k" },
  { id: "models", label: "Models", icon: "🌾", video: "DzCCYdRdV30" },
  { id: "eloquent", label: "ORM Eloquent", icon: "🐘", video: "snOXxJa31GI" },
  { id: "seeders", label: "Seeders & Factories", icon: "🌱", video: "4oxjaQCJRaA" },
  { id: "controllers", label: "Controllers", icon: "🎣", video: null },
  { id: "blade", label: "Views & Blade", icon: "🏡", video: "HOv9CqqAZk0" },
];

// Guia de estudo mostrado antes do quiz de cada trilha.
// Campos: intro (o que é), analogy (comparação do dia a dia), concepts (termos-chave),
// example (cenário), snippets (código de exemplo), pitfalls (pegadinhas), benefits.
const raw = String.raw;

const GUIDES = {
  mvc: {
    intro:
      "MVC (Model-View-Controller) é um padrão de arquitetura que divide a aplicação em três responsabilidades: o Model cuida dos dados e das regras de negócio, a View cuida do que o usuário enxerga e o Controller recebe a requisição, coordena as outras duas partes e devolve a resposta. Sem essa divisão, é comum acabar com HTML, SQL e regras misturados no mesmo arquivo — o que dificulta corrigir e evoluir o sistema.",
    analogy:
      "Pense numa biblioteca: o Controller é o atendente do balcão (recebe o pedido e decide o que fazer), o Model é o acervo com as regras da casa (sabe quais livros existem e calcula a multa por atraso) e a View é o comprovante ou a tela que mostra o resultado para o leitor.",
    concepts: [
      { t: "Model", d: "Representa os dados e as regras de negócio. No exemplo da biblioteca, é ele quem calcula a multa e sabe buscar os livros no banco." },
      { t: "View", d: "É a apresentação: monta o HTML que o usuário vê. Não deve tomar decisões de negócio nem consultar o banco." },
      { t: "Controller", d: "Recebe a solicitação, chama o Model e escolhe qual View devolver. No Laravel, cada URL é ligada a um método de Controller pelas rotas." },
      { t: "Cliente-servidor ≠ MVC", d: "Cliente-servidor descreve quem pede e quem responde (navegador e servidor). MVC descreve como organizar o código dentro da aplicação. São conceitos diferentes e podem ser usados juntos." },
      { t: "Camadas ≠ servidores", d: "Uma arquitetura em camadas é uma separação lógica do código. Não é preciso um servidor para cada camada: as três podem rodar no mesmo servidor." },
      { t: "Web e mobile", d: "Como a regra de negócio fica no Model e no Controller, o mesmo back-end pode devolver uma View (HTML) para o site e JSON para um aplicativo mobile." },
    ],
    example:
      "Fluxo de uma listagem de livros: o navegador pede /books → a rota chama o BookController → o Controller pede os livros ao Model → o Model busca no banco → o Controller entrega os dados para a View → a View monta o HTML → o navegador exibe a página.",
    snippets: [
      {
        file: "routes/web.php + BookController.php",
        code: raw`// A rota liga a URL ao método do Controller
Route::get('/books', [BookController::class, 'index']);

class BookController extends Controller
{
    public function index()
    {
        // Controller pede os dados ao Model...
        $books = Book::orderBy('title')->get();

        // ...e entrega para a View
        return view('books.index', ['books' => $books]);
    }
}`,
      },
      {
        file: "resources/views/books/index.blade.php",
        code: raw`{{-- A View só mostra os dados que recebeu --}}
@foreach ($books as $book)
    <li>{{ $book->title }}</li>
@endforeach`,
      },
    ],
    pitfalls: [
      "MVC não garante código perfeito sozinho: um Controller “gordo”, com regra de negócio e consultas dentro, quebra a separação mesmo usando o padrão.",
      "Cliente-servidor e MVC não são sinônimos: um trata da comunicação, o outro da organização do código.",
      "Camadas não precisam estar em servidores diferentes.",
    ],
    benefits: [
      "Cada camada evolui de forma independente, sem bagunçar as outras",
      "Fica mais fácil de testar, corrigir e dar manutenção",
      "Facilita o trabalho em equipe, já que cada parte pode ser desenvolvida em paralelo",
      "O mesmo back-end atende site e aplicativo, trocando apenas o formato da resposta",
    ],
  },

  frameworks: {
    intro:
      "Um framework é uma base de código pronta e organizada que resolve problemas comuns a quase todo sistema — rotas, acesso ao banco, autenticação, validação, segurança — para você não reescrever isso a cada projeto. O Laravel é um framework feito em PHP: usar Laravel não significa deixar de programar em PHP, e sim programar em PHP seguindo uma estrutura pronta.",
    analogy:
      "Uma biblioteca (de código) é uma caixa de ferramentas: você decide quando pegar cada ferramenta. Um framework é a planta de uma casa com a estrutura já erguida: ele define onde ficam as paredes e você preenche os cômodos com a lógica do seu sistema.",
    concepts: [
      { t: "Biblioteca × framework", d: "Na biblioteca, o seu código chama a biblioteca quando quiser. No framework, é ele quem organiza o fluxo e chama o seu código nos pontos certos (a chamada “inversão de controle”)." },
      { t: "Convenções", d: "O Laravel espera nomes padronizados: Model Book ↔ tabela books, BookController, views em books/. Seguindo as convenções, você escreve menos configuração." },
      { t: "Ferramentas embutidas", d: "Roteamento, Eloquent (ORM), Blade (templates), validação, autenticação, migrations, filas e testes já vêm integrados." },
      { t: "Artisan", d: "É a linha de comando do Laravel. Gera arquivos prontos (make:model, make:controller...) e executa tarefas (migrate, db:seed...)." },
      { t: "Composer", d: "Gerenciador de pacotes do PHP. É por ele que o Laravel e as bibliotecas extras são instalados e atualizados." },
    ],
    example:
      "Para criar o módulo de livros da biblioteca, um único comando do Artisan gera o Model, a migration, a factory, o seeder e o controller já no lugar certo. Você só preenche a lógica.",
    snippets: [
      {
        file: "terminal",
        code: raw`# -m migration, -f factory, -s seeder, -c controller
php artisan make:model Book -mfsc

# Vê todas as rotas registradas na aplicação
php artisan route:list`,
      },
    ],
    pitfalls: [
      "Usar Laravel não tira você do PHP: o código continua sendo PHP.",
      "Convenções economizam trabalho, mas só funcionam se você conhece os nomes esperados. Fugir do padrão exige configuração extra.",
      "Framework também tem curva de aprendizado: entender o que acontece “por trás” evita depender de mágica.",
    ],
    benefits: [
      "Desenvolvimento mais rápido, com menos código repetido",
      "Estrutura padronizada, mais fácil de entender entre projetos diferentes",
      "Segurança básica já embutida contra ataques comuns (SQL Injection, XSS e CSRF)",
      "Comunidade grande — fácil achar exemplos e tirar dúvidas",
    ],
  },

  migrations: {
    intro:
      "Migrations são arquivos PHP que descrevem, passo a passo, as mudanças na estrutura do banco (criar tabela, adicionar coluna, criar chave estrangeira). Funcionam como um controle de versão para o banco: cada arquivo tem um método up(), que aplica a mudança, e um down(), que a desfaz. O Laravel guarda numa tabela chamada migrations quais arquivos já rodaram.",
    analogy:
      "É o Git do banco de dados: em vez de alguém alterar tabelas na mão e avisar o time por mensagem, cada alteração vira um arquivo versionado que qualquer pessoa executa e obtém exatamente o mesmo banco.",
    concepts: [
      { t: "up() e down()", d: "up() aplica a mudança (ex.: criar a tabela books). down() faz o inverso (ex.: apagar a tabela), permitindo desfazer com segurança." },
      { t: "Schema::create × Schema::table", d: "create monta uma tabela nova. table altera uma tabela que já existe, como ao adicionar a coluna isbn em books." },
      { t: "Modificadores de coluna", d: "nullable() torna a coluna opcional, default() define um valor padrão, unique() impede valores repetidos, after() escolhe a posição." },
      { t: "Chave estrangeira", d: "foreignId('category_id')->constrained() cria a coluna category_id e a restrição que a liga à tabela categories (o nome da tabela é deduzido do nome da coluna)." },
      { t: "Lotes (batches)", d: "Cada execução de migrate forma um lote. O rollback desfaz o último lote inteiro, não apenas uma migration." },
      { t: "Migration, tabela e Model", d: "A migration cria a estrutura. A tabela guarda os dados. O Model é a classe PHP que representa aquela tabela — ele não a cria." },
    ],
    example:
      "A biblioteca já tem a tabela books e agora precisa guardar o ISBN. Em vez de mexer no banco manualmente, você gera uma nova migration só para isso e ela vale para o time inteiro.",
    snippets: [
      {
        file: "database/migrations/..._create_books_table.php",
        code: raw`Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->foreignId('author_id')->constrained(); // liga a authors.id
    $table->timestamps();
});`,
      },
      {
        file: "..._add_isbn_to_books_table.php",
        code: raw`// php artisan make:migration add_isbn_to_books_table --table=books
public function up(): void
{
    Schema::table('books', function (Blueprint $table) {
        $table->string('isbn', 20)->nullable()->after('title'); // opcional
    });
}

public function down(): void
{
    Schema::table('books', function (Blueprint $table) {
        $table->dropColumn('isbn');
    });
}`,
      },
      {
        file: "terminal",
        code: raw`php artisan migrate                  # aplica as migrations pendentes
php artisan migrate:status           # mostra quais já rodaram
php artisan migrate:rollback         # desfaz o último lote
php artisan migrate:refresh          # desfaz tudo e roda de novo
php artisan migrate:fresh --seed     # APAGA todas as tabelas, recria e popula`,
      },
    ],
    pitfalls: [
      "migrate:fresh apaga todas as tabelas e todos os dados antes de recriar. O --seed só insere dados de teste novos depois; ele não preserva o que existia. Use apenas em desenvolvimento.",
      "Não edite uma migration que já foi executada ou compartilhada: crie uma nova migration com a alteração.",
      "Declarar hasMany() ou belongsTo() no Model não cria coluna nem chave estrangeira. Isso só acontece na migration.",
      "A ordem importa: a tabela referenciada (authors) precisa ser criada antes da que tem a chave estrangeira (books). O Laravel segue a data no nome do arquivo.",
      "Escreva sempre o down(); sem ele o rollback não consegue desfazer a mudança.",
    ],
    benefits: [
      "Todo o time recria exatamente o mesmo banco em qualquer máquina",
      "Dá pra desfazer alterações com segurança, usando o rollback",
      "Banco de desenvolvimento e de produção ficam sincronizados",
      "O histórico de como o banco evoluiu fica registrado junto do código",
    ],
  },

  models: {
    intro:
      "O Model é a classe PHP que representa uma tabela do banco dentro do código. Ele estende o Model do Eloquent e, por convenção, a classe Book usa a tabela books. Mais do que um “nome para a tabela”, o Model concentra o que diz respeito àquela entidade: quais campos podem ser preenchidos, como ela se relaciona com outras e regras como conversões e cálculos.",
    analogy:
      "Se a tabela é o arquivo físico de fichas da biblioteca, o Model é o bibliotecário responsável por ele: sabe encontrar, cadastrar e apagar fichas e conhece a ligação de cada livro com o seu autor.",
    concepts: [
      { t: "$fillable", d: "Lista os campos que podem ser preenchidos em massa (create, update, fill). Protege contra o envio de campos que você não previu (mass assignment)." },
      { t: "hasOne / belongsTo", d: "Relação 1:1. Um Book tem um BookDetail (hasOne); o BookDetail pertence a um Book (belongsTo) e guarda a chave book_id." },
      { t: "hasMany / belongsTo", d: "Relação 1:N. Um Author tem vários Books (hasMany). A chave estrangeira author_id fica no lado “muitos”, na tabela books." },
      { t: "belongsToMany", d: "Relação N:N (Book e Category). Usa uma tabela intermediária, chamada pivô." },
      { t: "create(), save(), delete()", d: "create() insere um novo registro; save() grava alterações de um objeto (inserindo ou atualizando); delete() remove o registro." },
      { t: "$book->categories × $book->categories()", d: "Sem parênteses você recebe o resultado (a coleção de categorias). Com parênteses recebe a própria relação, à qual ainda é possível encadear filtros e operações como attach()." },
    ],
    example:
      "O Model Author declara que tem vários livros, e o Model Book declara a quem pertence. Com isso, $author->books e $book->author passam a funcionar sem escrever nenhum JOIN.",
    snippets: [
      {
        file: "app/Models/Author.php",
        code: raw`class Author extends Model
{
    protected $fillable = ['name'];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);   // 1 autor → N livros
    }
}`,
      },
      {
        file: "app/Models/Book.php",
        code: raw`class Book extends Model
{
    protected $fillable = ['title', 'isbn', 'author_id'];

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);   // FK author_id está aqui
    }

    public function detail(): HasOne
    {
        return $this->hasOne(BookDetail::class);  // 1:1
    }
}`,
      },
      {
        file: "usando o Model",
        code: raw`$book = Book::create(['title' => 'Dom Casmurro', 'author_id' => 1]); // insere
$book->title = 'Dom Casmurro (edição 2)';
$book->save();      // atualiza
$book->delete();    // remove`,
      },
    ],
    pitfalls: [
      "O Model não é apenas outro nome para a tabela: além de representá-la, ele carrega relacionamentos, conversões e regras da entidade.",
      "hasMany() e belongsTo() só descrevem a relação no código. A coluna e a foreign key precisam existir na migration.",
      "$fillable não substitui a validação. Ele controla quais campos podem ser gravados, mas não confere se os valores são válidos.",
      "Sem $fillable (ou $guarded), o create() com dados em massa lança erro de mass assignment.",
    ],
    benefits: [
      "Centraliza as regras de negócio de cada entidade num só lugar",
      "Se integra direto com o Eloquent, sem precisar escrever SQL manual",
      "É reaproveitado em vários pontos do sistema: controllers, seeders, comandos",
      "Relacionamentos declarados uma vez servem para todo o projeto",
    ],
  },

  eloquent: {
    intro:
      "Eloquent é o ORM (Object-Relational Mapping) do Laravel. Um ORM faz a ponte entre o mundo orientado a objetos e o banco relacional: cada tabela vira uma classe (o Model), cada linha vira um objeto e cada coluna vira um atributo. Você escreve consultas em PHP e o Eloquent as traduz para SQL, usando consultas preparadas, o que protege contra SQL Injection.",
    analogy:
      "É um tradutor simultâneo entre duas línguas: você fala PHP (Book::where(...)->get()) e o banco ouve SQL (SELECT ... WHERE ...). A migration monta a estrutura, o Model descreve a entidade e o Eloquent é o motor que faz a conversa acontecer.",
    concepts: [
      { t: "Migration × Model × ORM", d: "Migration cria a estrutura da tabela. Model representa a tabela no código. Eloquent (o ORM) usa o Model para ler e gravar dados." },
      { t: "Por que $book->title funciona?", d: "O Eloquent guarda as colunas num array interno de atributos e usa métodos mágicos do PHP para expô-los como propriedades, então não precisa declarar cada uma na classe." },
      { t: "where(), orderBy(), get()", d: "where filtra, orderBy ordena e get() executa a consulta e devolve a coleção. Sem o get() (ou first, paginate...), a consulta não roda." },
      { t: "find × findOrFail", d: "find() devolve o registro ou null. findOrFail() lança uma exceção quando não acha, que numa página web vira automaticamente um erro 404." },
      { t: "Eager loading e N+1", d: "Acessar $author->books dentro de um foreach faz uma consulta por autor (1 + N). Com with('books') o Eloquent busca tudo em poucas consultas." },
      { t: "paginate() + withQueryString()", d: "paginate(10) divide o resultado em páginas. withQueryString() mantém filtros da URL, como ?title=Laravel, nos links de página." },
      { t: "N:N: attach, detach e sync", d: "attach() cria vínculos na tabela pivô, detach() remove vínculos e sync() deixa exatamente os IDs informados. Os três mexem só no pivô." },
      { t: "Campos extras no pivô", d: "Colunas como featured e position ficam na tabela pivô: declare withPivot(...) na relação e informe os valores no attach()." },
    ],
    example:
      "Na tela de listagem da biblioteca, você quer os livros filtrados pelo título, com autor e categorias, ordenados e divididos em páginas de 10 — e sem disparar uma consulta extra para cada livro.",
    snippets: [
      {
        file: "consulta completa",
        code: raw`$books = Book::with(['author', 'categories'])   // eager loading
    ->where('title', 'like', '%Laravel%')
    ->orderBy('title')
    ->paginate(10)
    ->withQueryString();`,
      },
      {
        file: "o problema N+1",
        code: raw`// Ruim: 1 consulta para os autores + 1 por autor
foreach (Author::all() as $author) {
    echo $author->books->count();
}

// Bom: 2 consultas no total
foreach (Author::with('books')->get() as $author) {
    echo $author->books->count();
}`,
      },
      {
        file: "relação N:N (pivô book_category)",
        code: raw`// No Model Book
public function categories(): BelongsToMany
{
    return $this->belongsToMany(Category::class)
                ->withPivot('featured', 'position');
}

$book->categories()->attach(2, ['featured' => true, 'position' => 1]);
$book->categories()->sync([1, 3, 5]);   // fica só com 1, 3 e 5
$book->categories()->detach(3);         // remove só o vínculo`,
      },
    ],
    pitfalls: [
      "attach() e detach() mexem só na tabela pivô: eles não apagam livros nem categorias, apenas os vínculos entre eles.",
      "sync([1,3,5]) remove os vínculos que não estão na lista. Para apenas somar, use attach ou syncWithoutDetaching.",
      "Book::all() carrega tudo na memória. Com milhares de registros, prefira paginate() ou chunk().",
      "Acessar uma relação dentro de um laço sem eager loading gera o problema N+1.",
      "Os campos extras do pivô precisam existir como colunas na migration da tabela pivô.",
    ],
    benefits: [
      "Muito menos SQL repetitivo no código",
      "Proteção automática contra SQL Injection, pelas consultas preparadas",
      "Código mais legível, próximo da linguagem natural",
      "Trocar de banco de dados exige poucas mudanças no código",
    ],
  },

  seeders: {
    intro:
      "Factories e Seeders servem para popular o banco com dados de teste sem cadastrar tudo à mão. A Factory é o molde que sabe gerar um registro fictício de um Model. O Seeder é a classe que executa a população: usa as factories e também pode inserir dados fixos. Assim, sempre que o banco é recriado, ele volta com dados úteis em segundos.",
    analogy:
      "A Factory é a fôrma de biscoito: define o formato de cada livro fictício. O Seeder é quem assa a fornada: decide quantos biscoitos fazer e em qual bandeja colocar.",
    concepts: [
      { t: "migration → Factory → Seeder", d: "A migration cria a tabela, a Factory define como gerar um registro para ela e o Seeder insere os registros no banco." },
      { t: "definition()", d: "Método da Factory que devolve o array de valores de cada campo, normalmente usando fake() para gerar nomes, textos e números aleatórios." },
      { t: "HasFactory", d: "Trait que o Model usa para habilitar Book::factory(). Sem ela, o Model não sabe qual factory chamar." },
      { t: "make() × create()", d: "make() cria o objeto só em memória, sem salvar. create() salva no banco. count(10)->create() salva 10 registros de uma vez." },
      { t: "for() e has()", d: "for() liga o registro a um pai já existente (um livro de um autor). has() cria filhos junto (um autor com 3 livros)." },
      { t: "attach() em seeders", d: "Em relações N:N, o attach() liga registros já criados pela tabela pivô, como livros a categorias." },
      { t: "firstOrCreate()", d: "Procura o registro e só cria se ele não existir. Bom para dados fixos, como categorias, que não podem duplicar ao rodar o seeder de novo." },
      { t: "Executando", d: "db:seed roda o DatabaseSeeder (que chama os outros). db:seed --class=BookSeeder roda um específico." },
    ],
    example:
      "Na biblioteca, em vez de cadastrar 5 autores, 15 livros e as categorias pela interface toda vez que o banco é recriado, um Seeder faz isso em um comando.",
    snippets: [
      {
        file: "database/factories/BookFactory.php",
        code: raw`public function definition(): array
{
    return [
        'title'     => fake()->sentence(3),
        'isbn'      => fake()->unique()->isbn13(),
        'author_id' => Author::factory(),   // cria um autor se não passar um
    ];
}`,
      },
      {
        file: "database/seeders/DatabaseSeeder.php",
        code: raw`public function run(): void
{
    // 5 autores, cada um com 3 livros
    Author::factory()
        ->count(5)
        ->has(Book::factory()->count(3))
        ->create();

    // Dados fixos: não duplica se rodar de novo
    foreach (['Romance', 'Ficção', 'Técnico'] as $name) {
        Category::firstOrCreate(['name' => $name]);
    }
}`,
      },
      {
        file: "terminal",
        code: raw`php artisan db:seed                    # roda o DatabaseSeeder
php artisan db:seed --class=BookSeeder # roda só um seeder
php artisan migrate:fresh --seed       # recria o banco e popula`,
      },
    ],
    pitfalls: [
      "fake()->unique() só evita repetição entre os dados gerados. Não substitui o unique() da migration, que é o que protege o banco de verdade.",
      "Factories normalmente criam registros novos a cada execução: rodar o seeder duas vezes duplica os dados. Para dados fixos, use firstOrCreate().",
      "make() não salva nada. Se você esquecer o create(), o banco continua vazio.",
      "migrate:fresh --seed apaga os dados existentes antes de popular de novo.",
    ],
    benefits: [
      "Ambiente de testes populado em segundos",
      "Dados consistentes pra toda a equipe trabalhar em cima",
      "Evita cadastrar registro por registro durante o desenvolvimento",
      "Facilita testar paginação, filtros e relacionamentos com volume de dados",
    ],
  },

  controllers: {
    intro:
      "O Controller é a camada do MVC que recebe uma requisição já encaminhada pela rota, valida os dados que chegaram, conversa com o Model e decide o que responder — uma View, um redirecionamento ou um JSON. A boa prática é manter o Controller enxuto, delegando as regras de negócio ao Model.",
    analogy:
      "É o atendente do balcão: escuta o pedido do leitor, confere se o formulário foi preenchido direito, vai ao acervo (Model) e volta com a resposta — sem ele mesmo guardar os livros nem imprimir o comprovante.",
    concepts: [
      { t: "Rota → action", d: "Route::get('/books', [BookController::class, 'index']) liga a URL ao método index() do controller." },
      { t: "Resource Controller", d: "Reúne as 7 ações padrão de um CRUD: index (lista), create (mostra o formulário), store (salva), show (detalha), edit (mostra o formulário de edição), update (atualiza) e destroy (exclui)." },
      { t: "Route::resource()", d: "Registra todas essas rotas de uma vez, ligando-as ao controller. Ele cria só as rotas: não gera Views nem migrations." },
      { t: "Route model binding", d: "Em show(Book $book) com a rota /books/{book}, o Laravel busca o Book pelo id da URL e injeta o objeto. Se não existir, responde 404 sozinho." },
      { t: "Validação", d: "$request->validate([...]) confere os dados. Se falhar, o Laravel volta para o formulário com os erros e os valores antigos." },
      { t: "Filtro opcional", d: "when() ou filled() aplicam o where só se o parâmetro (?title=Laravel) tiver sido enviado, evitando filtrar por vazio." },
      { t: "Tipos de resposta", d: "view() devolve uma página, redirect() manda para outra rota, response()->json() devolve JSON, abort(404) interrompe com erro." },
    ],
    example:
      "A rota GET /books chama BookController@index, que aplica o filtro de título (se houver), pagina os livros e devolve a View. Já o update() valida os campos e garante que o ISBN continue único sem bloquear o próprio livro.",
    snippets: [
      {
        file: "routes/web.php",
        code: raw`// Cria as 7 rotas do CRUD: books.index, books.create, books.store...
Route::resource('books', BookController::class);`,
      },
      {
        file: "BookController.php — index() com filtro opcional",
        code: raw`public function index(Request $request)
{
    $books = Book::query()
        ->when($request->filled('title'), fn ($q) =>
            $q->where('title', 'like', '%'.$request->title.'%'))
        ->paginate(10)
        ->withQueryString();   // mantém ?title= nos links de página

    return view('books.index', ['books' => $books]);
}`,
      },
      {
        file: "BookController.php — update() com ISBN único",
        code: raw`// use Illuminate\Validation\Rule;
public function update(Request $request, Book $book)   // route model binding
{
    $data = $request->validate([
        'title' => ['required', 'string', 'max:255'],
        'isbn'  => ['required', Rule::unique('books', 'isbn')->ignore($book->id)],
    ]);

    $book->update($data);

    return redirect()->route('books.show', $book)
                     ->with('success', 'Livro atualizado!');
}`,
      },
    ],
    pitfalls: [
      "Route::resource() não cria Views nem migrations, apenas as rotas.",
      "O 404 automático do route model binding só trata registro inexistente. Ele não verifica se a pessoa pode ver ou editar aquele registro: para isso existem autorização, Policies e Gates.",
      "Sem ->ignore($book->id), a regra unique() acusa o próprio livro como duplicado ao atualizar.",
      "Validar só no navegador não basta: a validação no servidor é obrigatória.",
      "Controller “gordo” (com consultas e regras espalhadas) foge do MVC. Deixe a regra de negócio no Model.",
    ],
    benefits: [
      "Centraliza a lógica de cada funcionalidade num só lugar",
      "Mantém a View livre de lógica de negócio",
      "Facilita organizar rotas e permissões por ação",
      "O resource controller entrega um CRUD padronizado com pouquíssimo código",
    ],
  },

  blade: {
    intro:
      "A View é a camada que o usuário enxerga, e o Blade é o motor de templates do Laravel. Os arquivos ficam em resources/views com a extensão .blade.php e misturam HTML com diretivas curtas (@if, @foreach...). O Laravel compila cada template para PHP puro e guarda em cache, então o código fica mais limpo sem perder desempenho.",
    analogy:
      "Um layout Blade é como um formulário timbrado com espaços em branco reservados (cabeçalho, conteúdo, rodapé). Cada página só preenche os espaços que mudam, sem redesenhar o papel inteiro.",
    concepts: [
      { t: "{{ $x }} × {!! $x !!}", d: "As chaves duplas escapam caracteres especiais do HTML, protegendo contra XSS. O {!! !!} imprime sem escapar e só deve ser usado com conteúdo confiável." },
      { t: "@if, @foreach, @forelse", d: "@forelse repete uma lista e, com @empty, trata de uma vez o caso de ela estar vazia." },
      { t: "Layouts", d: "O layout reserva áreas com @yield('content'). A página usa @extends('layouts.app') e preenche a área com @section('content') ... @endsection." },
      { t: "Passando dados", d: "return view('books.index', ['books' => $books]) envia a variável $books do Controller para a View." },
      { t: "@csrf", d: "Adiciona ao formulário um token que protege contra CSRF (requisições forjadas). Sem ele, o Laravel responde 419." },
      { t: "@method('PUT')", d: "Formulários HTML só enviam GET e POST. Essa diretiva cria um campo escondido para o Laravel tratar a requisição como PUT, PATCH ou DELETE." },
      { t: "old() e @error", d: "old('title') repõe o que a pessoa digitou depois de um erro de validação. @error('title') mostra a mensagem daquele campo." },
      { t: "Paginação", d: "$books->links() desenha a navegação entre páginas. Com withQueryString() no Controller, os filtros da URL são preservados; links('partials.pagination') usa um visual personalizado." },
    ],
    example:
      "A página de listagem e a de edição de livros herdam o mesmo layout, e o formulário de cadastro e o de edição reaproveitam um único arquivo parcial, que mostra os valores atuais ou os antigos quando houve erro.",
    snippets: [
      {
        file: "resources/views/layouts/app.blade.php",
        code: raw`<html>
  <body>
    <header>Biblioteca</header>
    @yield('content')   {{-- área que cada página vai preencher --}}
  </body>
</html>`,
      },
      {
        file: "resources/views/books/index.blade.php",
        code: raw`@extends('layouts.app')

@section('content')
  @forelse ($books as $book)
    <p>{{ $book->title }}</p>      {{-- escapa o HTML --}}
  @empty
    <p>Nenhum livro encontrado.</p>
  @endforelse

  {{ $books->links() }}
@endsection`,
      },
      {
        file: "resources/views/books/edit.blade.php",
        code: raw`<form method="POST" action="{{ route('books.update', $book) }}">
  @csrf
  @method('PUT')

  <input name="title" value="{{ old('title', $book->title) }}">
  @error('title')
    <small>{{ $message }}</small>
  @enderror

  <button>Salvar</button>
</form>`,
      },
    ],
    pitfalls: [
      "Consultas e exclusões dentro do Blade são má prática: buscar e alterar dados é trabalho do Controller e do Model.",
      "old() e @error só melhoram a experiência. Eles não eliminam a validação no servidor.",
      "Esquecer o @csrf num formulário POST resulta em erro 419.",
      "{!! !!} com conteúdo digitado por usuários abre brecha para XSS.",
      "O Laravel pode renderizar Blade no servidor e, ao mesmo tempo, expor rotas de API em JSON para outros front-ends (como React ou um app mobile).",
    ],
    benefits: [
      "Sintaxe mais limpa que misturar PHP puro dentro do HTML",
      "Herança de layout, sem repetir cabeçalho e rodapé em cada página",
      "Escape automático de HTML, com proteção contra XSS por padrão",
      "É compilado e cacheado automaticamente pelo Laravel, sem perder performance",
    ],
  },
};


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
