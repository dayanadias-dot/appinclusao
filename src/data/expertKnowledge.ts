import { GuideStrategy, ScreeningItem, NeurotypeCategory, SupportLevel } from '../types';

export const INSPIRING_QUOTES = [
  {
    quote: "A inclusão não é sobre trazer as pessoas para um mundo padronizado, é sobre transformar a escola em um espaço onde todas as mentes floresçam.",
    author: "Pedagogia Inclusiva Contemporânea"
  },
  {
    quote: "Neurodiversidade é a ideia de que diferenças neurológicas como TEA, TDAH e Dislexia são variações naturais e enriquecedoras da experiência humana.",
    author: "Judy Singer (Socióloga & Ativista)"
  },
  {
    quote: "Se uma criança não pode aprender da maneira que ensinamos, talvez devêssemos ensinar da maneira que ela aprende.",
    author: "Ignacio Estrada"
  },
  {
    quote: "A equidade na educação significa dar a cada aluno o que ele precisa para alcançar seu pleno potencial, não dar a todos a mesma coisa.",
    author: "Princípio do Desenho Universal para a Aprendizagem (DUA)"
  },
  {
    quote: "O comportamento de um estudante neurodivergente é uma forma de comunicação. Antes de corrigir, precisamos decodificar a necessidade não atendida.",
    author: "Ross W. Greene"
  }
];

export const NEUROTYPE_INFO: Record<NeurotypeCategory, { label: string; badgeColor: string; description: string }> = {
  TEA: {
    label: 'TEA (Autismo)',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Variações na comunicação social, padrões de interesse aprofundados e sensibilidade sensorial.'
  },
  TDAH: {
    label: 'TDAH',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    description: 'Diferenças na regulação atencional, funções executivas, níveis de energia e dopamina.'
  },
  Dislexia: {
    label: 'Dislexia',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Dificuldade na decodificação e fluência da leitura, frequentemente acompanhada de pensamento tridimensional criativo.'
  },
  Discalculia: {
    label: 'Discalculia',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    description: 'Dificuldade na compreensão do senso numérico, conceitos e operações matemáticas.'
  },
  Dispraxia: {
    label: 'Dispraxia / TDC',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    description: 'Desafio no planejamento motor fino e global, coordenação corporal e caligrafia.'
  },
  AH_SD: {
    label: 'Altas Habilidades / SD',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    description: 'Capacidade de raciocínio avançada, intensidade emocional, sede de saber e pensamento divergente.'
  },
  TOD: {
    label: 'TOD (Opositivo Desafiador)',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    description: 'Hiper-reatividade à frustração e percepção de controle, necessitando de previsibilidade e manejo colaborativo.'
  },
  TPS: {
    label: 'Proc. Sensorial (TPS)',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    description: 'Dificuldade de filtrar ou processar estímulos táteis, auditivos, visuais ou vestibulares.'
  },
  Deficiencia_Intelectual: {
    label: 'Deficiência Intelectual',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    description: 'Necessidade de mediação concreta, apoio na autonomia prática e adaptação conceitual.'
  },
  Outro: {
    label: 'Outras Necessidades',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Demandas educacionais específicas a serem mapeadas individualmente.'
  }
};

export const SUPPORT_LEVEL_INFO: Record<SupportLevel, { label: string; badge: string; description: string }> = {
  monitoring: {
    label: 'Acompanhamento / Observação',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Alvo de rastreio ou acompanhamento preventivo das funções escolares.'
  },
  level_1: {
    label: 'Nível 1 (Apoio Leve / Inicial)',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Precisa de suporte em organização de rotina, transições e adaptações flexíveis de avaliação.'
  },
  level_2: {
    label: 'Nível 2 (Apoio Substancial)',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Requer apoio contínuo em comunicação, modulação de tarefas passo a passo e regulação sensorial.'
  },
  level_3: {
    label: 'Nível 3 (Apoio Muito Substancial)',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Demanda mediação pedagógica individualizada diária, comunicação alternativa e suporte intensivo em autonomia.'
  }
};

export const PEDAGOGICAL_GUIDE: GuideStrategy[] = [
  {
    id: 'man-1',
    title: 'Manejo de Sobrecarga Sensorial e Prevenção de Meltdown',
    category: 'psychological',
    targetNeurotypes: ['TEA', 'TPS', 'TDAH'],
    supportLevels: ['level_1', 'level_2', 'level_3'],
    problemScenario: 'O aluno tapa os ouvidos, chora, corre da sala ou fica rígido ao ser exposto a ambientes barulhentos (recreio, fila do lanche, sino).',
    whatToDo: [
      'Respeite o sinal inicial de estresse: valide imediatamente ("Vejo que o barulho está forte para você hoje").',
      'Ofereça fones redutores de ruído ou acesso antecipado ao "Cantinho da Calma/Descompressão".',
      'Reduza as luzes ou diminua a demanda verbal durante a crise (não faça perguntas longas ou broncas).',
      'Mantenha sua voz em tom suave, calmo e com frases curtas de 3 a 4 palavras.',
      'Permita uso de objetos reguladores táteis (fidget toys, massinha, almofada de peso).'
    ],
    whatToAvoid: [
      'NÃO trate o meltdown como "birra" ou desobediência disciplinar (é uma sobrecarga neurológica involuntária).',
      'NÃO force contato visual ou toque físico sem permissão explícita.',
      'NÃO realize intervenções em público na frente da turma inteira.'
    ],
    classroomExample: 'Antes de tocar o sinal, o professor avisa o aluno com 3 minutos de antecedência: "Em 3 minutos o sino vai tocar. Você quer colocar seu abafador agora ou sair 1 minuto antes?"',
    tags: ['Meltdown', 'Sensorial', 'Autorregulação', 'Ruído', 'Cantinho da Calma']
  },
  {
    id: 'man-2',
    title: 'Estruturação de Rotina Visual com Antecipação (Princípio TEACCH)',
    category: 'pedagogical',
    targetNeurotypes: ['TEA', 'TDAH', 'Deficiencia_Intelectual'],
    supportLevels: ['level_1', 'level_2', 'level_3'],
    problemScenario: 'O aluno demonstra grande ansiedade, desorganização motora ou recusa ao mudar de matéria ou ao ter um professor substituto.',
    whatToDo: [
      'Monte na carteira do aluno ou na lousa uma linha do tempo visual do dia com cartões móveis (pictogramas ou escrita).',
      'Use a regra "Primeiro [Atividade], Depois [Pausa/Recompensa de Interesse]".',
      'Use temporizadores visuais (Time Timer analógico ou digital com ampulheta de cores).',
      'Avise sempre sobre imprevistos com o cartão surpresa ("Hoje teremos uma mudança amigável: palestra no lugar de artes").'
    ],
    whatToAvoid: [
      'NÃO faça transições bruscas dizendo apenas "Guardem tudo agora!".',
      'NÃO retire o tempo livre/recreio como forma de punição por não concluir a tarefa.'
    ],
    classroomExample: 'Cartão visual na mesa do Lucas: [1. Matemática 15min] -> [2. Beber água] -> [3. Leitura com desenho] -> [4. Recreio]. Ao concluir cada passo, o próprio aluno vira a ficha.',
    tags: ['Rotina Visual', 'Previsibilidade', 'TEACCH', 'Transições']
  },
  {
    id: 'man-3',
    title: 'Adaptação Curricular para Dislexia: Redução de Barreira Textual',
    category: 'pedagogical',
    targetNeurotypes: ['Dislexia'],
    supportLevels: ['level_1', 'level_2'],
    problemScenario: 'O aluno gasta tanta energia decodificando letras que não consegue reter o conteúdo de História ou Ciências, ficando frustrado e desanimado.',
    whatToDo: [
      'Disponibilize leitores de tela digitais ou leitura mediada pelo professor/colega tutor.',
      'Utilize fontes amigáveis (Lexend, OpenDyslexic), tamanho 14-16pt, espaçamento entre linhas de 1.5 a 1.8 e fundo em tom creme suave (off-white) para evitar reflexo.',
      'Permita que o aluno responda avaliações oralmente, por esquema visual, desenhos conceituais ou gravação de áudio.',
      'Destaque palavras-chave com cores ou negrito em enunciados extensos.'
    ],
    whatToAvoid: [
      'NÃO obrigue o aluno com dislexia a ler textos longos em voz alta diante de toda a classe.',
      'NÃO desconte pontos sistemáticos de ortografia em disciplinas onde o foco é o conteúdo conceitual (como Ciências ou Geografia).'
    ],
    classroomExample: 'Na prova de História sobre Roma Antiga, em vez de 5 perguntas dissertativas longas, a prova do aluno inclui uma linha do tempo ilustrada e ele pode explicar os fatos oralmente ao professor de AEE.',
    tags: ['Dislexia', 'Acessibilidade Textual', 'Avaliação Oral', 'Lexend', 'Autoestima']
  },
  {
    id: 'man-4',
    title: 'Manejo de Hiperatividade e Pausas Motoras com Sentido Pedagógico',
    category: 'pedagogical',
    targetNeurotypes: ['TDAH', 'TPS'],
    supportLevels: ['level_1', 'level_2'],
    problemScenario: 'O estudante levanta constantemente da cadeira, mexe em todos os materiais e não consegue permanecer focado por mais de 8 minutos seguidos.',
    whatToDo: [
      'Programe "pausas funcionais ativas": peça para o aluno apagar o quadro, levar um bilhete à secretaria, recolher cadernos ou organizar materiais.',
      'Permita o uso de elásticos de resistência presos às pernas da cadeira ou almofadas de equilíbrio dinâmico.',
      'Fragmente a tarefa grande em micro-tarefas ("Primeiro responda até a questão 2, depois faça uma pausa de 2 minutos para se esticar").',
      'Permita que o aluno trabalhe em pé em momentos específicos ou use uma prancheta apoiada.'
    ],
    whatToAvoid: [
      'NÃO mande o aluno "parar de se mexer imediatamente", pois o movimento muitas vezes é o recurso fisiológico que ele usa para manter o córtex ativado.',
      'NÃO o isole no fundo da sala ou em frente à parede como castigo.'
    ],
    classroomExample: 'O professor define com Gabriel: a cada 2 blocos de exercícios concluídos, ele tem a missão oficial de ser o "Guardião dos Livros" e distribuir a próxima atividade.',
    tags: ['TDAH', 'Pausa Motora', 'Microtarefas', 'Disfunção Executiva']
  },
  {
    id: 'man-5',
    title: 'Mediação de Pares e Cultura de Empatia na Turma (Sem Capacitismo)',
    category: 'social',
    targetNeurotypes: ['TEA', 'TDAH', 'Dislexia', 'AH_SD', 'Deficiencia_Intelectual'],
    supportLevels: ['level_1', 'level_2', 'level_3'],
    problemScenario: 'Alunos típicos estranham comportamentos atípicos (estereotipias, falar sozinho, uso de fone) e o aluno neurodivergente fica isolado no intervalo e trabalhos em grupo.',
    whatToDo: [
      'Promova rodas de conversa sobre "Cérebros Diferentes": livros infantojuvenis e animações que ensinam que cada cérebro processa o mundo de forma singular.',
      'Estabeleça a estratégia do "Amigo Parceiro / Tutor Voluntário", rotacionando os colegas para que todos aprendam a conviver e apoiar.',
      'Planeje dinâmicas cooperativas onde cada membro do grupo contribui com seu ponto forte (ex: um pesquisa, outro desenha, outro apresenta).',
      'Valide e normalize acomodações sensoriais na frente de todos ("Assim como óculos ajudam a enxergar, os fones ajudam a filtrar sons").'
    ],
    whatToAvoid: [
      'NÃO trate o aluno neurodivergente como "coitadinho" ou "anjinho sem autonomia".',
      'NÃO deixe a formação de grupos livre quando houver risco evidente de rejeição ou exclusão sistemática.'
    ],
    classroomExample: 'Em um projeto de Ciências sobre o Sistema Solar, o aluno com TEA com hiperfoco em planetas ficou responsável por curar os fatos científicos e desenhos, enquanto o colega redigiu o cartaz.',
    tags: ['Inclusão Social', 'Anti-Capacitismo', 'Trabalho em Grupo', 'Amigo Tutor']
  },
  {
    id: 'man-6',
    title: 'Manejo Colaborativo de Comportamento Opositivo (TOD / Desafio)',
    category: 'psychological',
    targetNeurotypes: ['TOD', 'TDAH'],
    supportLevels: ['level_1', 'level_2'],
    problemScenario: 'Ao receber uma ordem direta ("Abra o livro na página 20 agora"), o aluno responde com raiva: "Não vou abrir, você não manda em mim!".',
    whatToDo: [
      'Use a técnica de "Oferta de Escolhas Dirigidas" para devolver a percepção de autonomia ("Você prefere começar pela página 20 ou fazer a questão ímpar da página 21 primeiro?").',
      'Não entre em escalada de poder. Responda em tom neutro e dê tempo de processamento: "Vou dar 2 minutos para você escolher qual das opções prefere e já volto aqui".',
      'Utilize o reforço positivo antecipado e elogio descritivo quando ele cooperar ("Percebi que você conseguiu respirar fundo e escolheu a opção, isso foi muito maduro").',
      'Combine regras e combinados previamente em momentos de calma, nunca durante o conflito.'
    ],
    whatToAvoid: [
      'NÃO grite, não use ironia nem faça ameaças na frente dos colegas.',
      'NÃO exija submissão imediata; o aluno com TOD enxerga confronto direto como uma ameaça à sua integridade.'
    ],
    classroomExample: 'Em vez de "Guarde o brinquedo já!", o professor diz: "Você prefere guardar seu carrinho na mochila agora ou daqui a 1 minuto quando o timer apitar?". O aluno escolhe a segunda e cumpre com tranquilidade.',
    tags: ['TOD', 'Desescalada', 'Escolhas Dirigidas', 'Sem Conflito de Poder']
  },
  {
    id: 'man-7',
    title: 'Enriquecimento Curricular para Altas Habilidades com Dupla Excepcionalidade (2E)',
    category: 'pedagogical',
    targetNeurotypes: ['AH_SD', 'TDAH', 'TEA'],
    supportLevels: ['level_1', 'monitoring'],
    problemScenario: 'Aluno termina tarefas em 3 minutos, demonstra tédio profundo e começa a atrapalhar a aula, mas tem dificuldades motoras na escrita ou na interação.',
    whatToDo: [
      'Aplique o modelo de Enriquecimento Curricular (ampliação em profundidade e complexidade, e não mero acúmulo de mais exercícios idênticos).',
      'Permita que o aluno lidere mini-projetos de pesquisa sobre seus temas de interesse conectado à matéria.',
      'Proponha desafios com perguntas abertas e pensamento divergente ("E se a gravidade da Terra fosse o dobro? Como seriam os transportes?").',
      'Acolha a assincronia de desenvolvimento (cognição de 15 anos com maturidade emocional e coordenação de 8 anos).'
    ],
    whatToAvoid: [
      'NÃO "premie" quem termina rápido dando mais folhas da mesma conta repetitiva.',
      'NÃO ignore as dificuldades socioemocionais só porque a criança é intelectualmente brilhante.'
    ],
    classroomExample: 'Enquanto a turma pratica operações básicas, a aluna Beatriz (AH/SD em matemática) cria um código criptográfico baseado em números primos para os colegas tentarem decifrar.',
    tags: ['Altas Habilidades', 'Dupla Excepcionalidade', 'Enriquecimento', 'Assincronia']
  }
];

export const SCREENING_QUESTIONS: ScreeningItem[] = [
  {
    id: 'scr-1',
    category: 'social_interaction',
    question: 'Demonstra dificuldade em iniciar ou sustentar trocas sociais recíprocas com colegas (prefere brincar sozinho ou com regras muito rígidas)?',
    neurotypeIndicator: 'TEA',
    score: 0
  },
  {
    id: 'scr-2',
    category: 'social_interaction',
    question: 'Tem dificuldade em compreender pistas sociais não verbais (expressões faciais, ironias, metáforas ou "ler o clima da sala")?',
    neurotypeIndicator: 'TEA',
    score: 0
  },
  {
    id: 'scr-3',
    category: 'communication',
    question: 'Apresenta linguagem excessivamente formal/robótica, repetição de frases de desenhos/jogos (ecolalia) ou fala quase exclusivamente sobre seu tema preferido?',
    neurotypeIndicator: 'TEA',
    score: 0
  },
  {
    id: 'scr-4',
    category: 'sensory_processing',
    question: 'Apresenta reações extremas a estímulos sensoriais comuns (tapa os ouvidos com sons altos, rejeita certas texturas, incomoda-se com iluminação forte ou etiquetas de roupas)?',
    neurotypeIndicator: 'TPS',
    score: 0
  },
  {
    id: 'scr-5',
    category: 'sensory_processing',
    question: 'Busca constante de estímulos motores intensos (balançar o corpo, pular repetidamente, mastigar objetos ou bater mãos/flapping)?',
    neurotypeIndicator: 'TPS',
    score: 0
  },
  {
    id: 'scr-6',
    category: 'attention_executive',
    question: 'Comete erros frequentes por descuido em tarefas escolares, parece não escutar quando chamado diretamente ou perde objetos necessários com muita facilidade?',
    neurotypeIndicator: 'TDAH',
    score: 0
  },
  {
    id: 'scr-7',
    category: 'attention_executive',
    question: 'Dificuldade notável em manter a atenção até o fim de instruções compostas (começa a tarefa e desvia para outro foco em poucos minutos)?',
    neurotypeIndicator: 'TDAH',
    score: 0
  },
  {
    id: 'scr-8',
    category: 'motor_regulation',
    question: 'Mexer constantemente pés ou mãos, levantar-se da cadeira em momentos em que se espera permanecer sentado, ou fala excessiva e ininterrupta?',
    neurotypeIndicator: 'TDAH',
    score: 0
  },
  {
    id: 'scr-9',
    category: 'academic_learning',
    question: 'Dificuldade persistente em associar letras aos seus sons correspondentes (consciência fonológica), invertendo letras (p/q, b/d) com frequência acima do esperado para a idade?',
    neurotypeIndicator: 'Dislexia',
    score: 0
  },
  {
    id: 'scr-10',
    category: 'academic_learning',
    question: 'Leitura lenta, silabada e com grande fadiga mental, com grande discrepância entre o que o aluno compreende oralmente e o que consegue ler sozinho?',
    neurotypeIndicator: 'Dislexia',
    score: 0
  },
  {
    id: 'scr-11',
    category: 'academic_learning',
    question: 'Dificuldade expressiva em compreender quantidade numérica, ordenação temporal (dias da semana, meses) ou cálculo de operações básicas mesmo com apoio concreto?',
    neurotypeIndicator: 'Discalculia',
    score: 0
  },
  {
    id: 'scr-12',
    category: 'motor_regulation',
    question: 'Apresenta caligrafia ilegível com dor na mão ao segurar o lápis, dificuldade em cortar com tesoura, tropeça frequentemente ou esbarra em móveis?',
    neurotypeIndicator: 'Dispraxia',
    score: 0
  },
  {
    id: 'scr-13',
    category: 'academic_learning',
    question: 'Demonstra raciocínio excepcionalmente rápido em resolver problemas complexos, vocabulário avançado incomum para a faixa etária e curiosidade intensa?',
    neurotypeIndicator: 'AH_SD',
    score: 0
  },
  {
    id: 'scr-14',
    category: 'social_interaction',
    question: 'Frequentemente discute com figuras de autoridade, recusa deliberadamente cumprir regras escolares, ou culpa os colegas por seus próprios erros?',
    neurotypeIndicator: 'TOD',
    score: 0
  }
];
