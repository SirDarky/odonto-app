export const ANAMNESIS_TEMPLATES = [
    {
        id: 'clinica_geral_completa',

        title: 'Clínica Geral Avançada',

        description:
            'Anamnese completa cobrindo histórico médico, odontológico e sistêmico.',

        questions: [
            { text: 'Qual o motivo principal da consulta hoje?', type: 'text' },

            {
                text: 'Está sob cuidados médicos por algum motivo específico no momento?',

                type: 'textarea',
            },

            {
                text: 'Apresenta alguma destas condições médicas?',

                type: 'checkbox',

                options: [
                    'Diabetes',

                    'Hipertensão',

                    'Problemas Cardíacos',

                    'Asma/Bronquite',

                    'Distúrbios de Coagulação',

                    'Epilepsia',

                    'Gastrite/Úlcera',
                ],
            },

            {
                text: 'Possui alergia a algum destes itens?',

                type: 'checkbox',

                options: [
                    'Penicilina',

                    'Dipirona',

                    'Iodo',

                    'Látex',

                    'Anestésicos Locais',

                    'Anti-inflamatórios',
                ],
            },

            {
                text: 'Está fazendo uso de algum medicamento atualmente? (Liste nomes e doses)',

                type: 'textarea',
            },

            {
                text: 'Já teve febre reumática ou sopro no coração?',

                type: 'boolean',
            },

            {
                text: 'Sangra excessivamente após cortes ou extrações dentárias?',

                type: 'boolean',
            },

            {
                text: 'É fumante ou faz uso de produtos derivados de tabaco?',

                type: 'radio',

                options: [
                    'Não fumante',

                    'Fumante ocasional',

                    'Fumante ativo',

                    'Ex-fumante',
                ],
            },

            { text: 'Seu hálito ou gengiva incomodam você?', type: 'boolean' },

            {
                text: 'Range ou aperta os dentes durante o dia ou noite?',

                type: 'boolean',
            },
        ],
    },

    {
        id: 'ortodontia',

        title: 'Ortodontia Especializada',

        description:
            'Focado em crescimento, hábitos deletérios e histórico articular (ATM).',

        questions: [
            {
                text: 'Já usou aparelho ortodôntico anteriormente?',

                type: 'boolean',
            },

            {
                text: 'Possui algum destes hábitos?',

                type: 'checkbox',

                options: [
                    'Respirar pela boca',

                    'Roer unhas',

                    'Chupar dedo/chupeta',

                    'Morder objetos (canetas)',
                ],
            },

            {
                text: 'Sente estalidos ou dor ao abrir/fechar a boca?',

                type: 'boolean',
            },

            {
                text: 'Possui dificuldades na fala ou deglutição?',

                type: 'boolean',
            },

            {
                text: 'Tem dores de cabeça ou na região do ouvido com frequência?',

                type: 'boolean',
            },

            {
                text: 'O que mais incomoda no seu sorriso atualmente?',

                type: 'textarea',
            },
        ],
    },

    {
        id: 'implantodontia_cirurgia',

        title: 'Implantodontia e Cirurgia',

        description: 'Focado em metabolismo ósseo e risco cirúrgico rigoroso.',

        questions: [
            {
                text: 'Faz uso de bifosfonatos (medicamentos para osteoporose)?',

                type: 'boolean',
            },

            {
                text: 'Já realizou radioterapia ou quimioterapia?',

                type: 'boolean',
            },

            {
                text: 'Como é o seu processo de cicatrização normalmente?',

                type: 'radio',

                options: [
                    'Rápido/Normal',

                    'Lento',

                    'Costumo ter infecções',

                    'Tenho queloides',
                ],
            },

            {
                text: 'Apresenta sensibilidade ou dor em algum dente específico?',

                type: 'text',
            },

            {
                text: 'Consome bebidas alcoólicas?',

                type: 'radio',

                options: ['Não consome', 'Socialmente', 'Frequentemente'],
            },

            {
                text: 'Está grávida ou amamentando? (Para pacientes do sexo feminino)',

                type: 'boolean',
            },

            {
                text: 'Possui algum implante médico no corpo (marcapasso, próteses ósseas)?',

                type: 'text',
            },
        ],
    },

    {
        id: 'pediatria',

        title: 'Odontopediatria',

        description:
            'Anamnese adaptada para o histórico infantil e hábitos da criança.',

        questions: [
            {
                text: 'Como foi o período de gestação e o nascimento?',

                type: 'textarea',
            },

            {
                text: 'A criança faz uso de mamadeira ou chupeta?',

                type: 'radio',

                options: ['Não usa', 'Apenas para dormir', 'Uso frequente'],
            },

            {
                text: 'Qual a frequência de ingestão de doces/açúcar por dia?',

                type: 'radio',

                options: ['Raramente', '1 a 2 vezes', 'Mais de 3 vezes'],
            },

            {
                text: 'A criança já teve alguma experiência traumática em dentista?',

                type: 'boolean',
            },

            {
                text: 'Quem realiza a escovação dos dentes da criança?',

                type: 'radio',

                options: ['A própria criança', 'Os pais/responsáveis', 'Ambos'],
            },
        ],
    },
    {
        id: 'clinica_geral_completa',
        title: 'Clínica Geral Avançada e Risco Sistêmico',
        description:
            'Anamnese profunda com foco em segurança biológica, histórico médico e triagem psicossocial.',
        questions: [
            {
                text: 'Queixa Principal: O que o traz ao consultório hoje e há quanto tempo isso o incomoda?',
                type: 'textarea',
            },
            {
                text: 'Está sob tratamento médico ou acompanhamento por alguma doença específica?',
                type: 'textarea',
            },
            {
                text: 'Histórico Sistêmico (Marque todas as que se aplicam):',
                type: 'checkbox',
                options: [
                    'Diabetes (Tipo I ou II)',
                    'Hipertensão Arterial',
                    'Cardiopatias (Sopro, Arritmia, Infarto Prévio)',
                    'Problemas Renais ou Hepáticos',
                    'Distúrbios de Tireoide',
                    'Asma / DPOC / Bronquite',
                    'Epilepsia / Convulsões',
                    'Gastrite / Refluxo Gastroesofágico',
                    'Anemia ou Distúrbios Sanguíneos',
                    'HIV / Hepatites / ISTs',
                    'Tuberculose',
                    'Neoplasias (Câncer)',
                ],
            },
            {
                text: 'Alergias Conhecidas:',
                type: 'checkbox',
                options: [
                    'Penicilina / Amoxicilina',
                    'Dipirona',
                    'Iodo / Contrastes',
                    'Látex',
                    'Anestésicos Locais',
                    'Anti-inflamatórios (AINEs)',
                    'Aspirina',
                    'Sulfa',
                ],
            },
            {
                text: 'Medicamentos em uso (incluindo anticoncepcionais, suplementos ou fitoterápicos):',
                type: 'textarea',
            },
            {
                text: 'Já precisou de Profilaxia Antibiótica para realizar procedimentos dentários?',
                type: 'boolean',
            },
            {
                text: 'Já foi hospitalizado ou passou por cirurgias? (Descreva o motivo e eventuais complicações)',
                type: 'textarea',
            },
            {
                text: 'Apresenta sangramento excessivo após cortes ou pequenas extrações?',
                type: 'boolean',
            },
            {
                text: 'Hábitos e Estilo de Vida:',
                type: 'checkbox',
                options: [
                    'Tabagista (Cigarro/Vape)',
                    'Uso de Álcool Frequente',
                    'Uso de Drogas Recreativas',
                    'Prática de Esportes de Contato',
                    'Dieta Rica em Açúcar/Ácidos',
                ],
            },
            {
                text: 'Você se considera uma pessoa ansiosa para tratamentos odontológicos?',
                type: 'radio',
                options: [
                    'Tranquilo',
                    'Levemente ansioso',
                    'Muito ansioso / Fobia',
                ],
            },
        ],
    },
    {
        id: 'ortodontia_dtm',
        title: 'Ortodontia e Disfunção Temporomandibular (DTM)',
        description:
            'Focado em biomecânica, crescimento, hábitos parafuncionais e saúde articular.',
        questions: [
            {
                text: 'Qual sua expectativa principal com o tratamento ortodôntico (estética ou função)?',
                type: 'textarea',
            },
            {
                text: 'Já realizou tratamento ortodôntico antes? Se sim, por que parou ou por que houve recidiva?',
                type: 'textarea',
            },
            {
                text: 'Hábitos Parafuncionais:',
                type: 'checkbox',
                options: [
                    'Respiração Bucal',
                    'Ronco / Apneia do Sono',
                    'Roer unhas (Onicofagia)',
                    'Chupar dedo ou caneta',
                    'Empurrar os dentes com a língua',
                    'Morder bochechas/lábios',
                ],
            },
            {
                text: 'Sente dor de cabeça, pescoço ou cansaço muscular ao acordar?',
                type: 'boolean',
            },
            {
                text: 'Percebe ruídos (estalos/crepitação) ou travamento na articulação perto do ouvido?',
                type: 'boolean',
            },
            {
                text: 'Já sofreu algum trauma na face ou queda que atingiu o queixo?',
                type: 'boolean',
            },
            {
                text: 'Sente que seus dentes estão ficando "curtos" ou desgastados?',
                type: 'boolean',
            },
        ],
    },
    {
        id: 'implantodontia_reabilitacao',
        title: 'Implantodontia e Reabilitação Oral',
        description:
            'Rigoroso controle de metabolismo ósseo, cicatrização e viabilidade cirúrgica.',
        questions: [
            {
                text: 'Faz ou já fez uso de Bisfosfonatos ou remédios para Osteoporose/Câncer (ex: Alendronato, Zometa)?',
                type: 'boolean',
            },
            {
                text: 'Já passou por sessões de Radioterapia ou Quimioterapia em qualquer momento da vida?',
                type: 'boolean',
            },
            {
                text: 'Qualidade da Cicatrização:',
                type: 'radio',
                options: [
                    'Normal',
                    'Lenta',
                    'Histórico de Alvéolo Seco',
                    'Tendência a Queloides',
                ],
            },
            {
                text: 'É diabético? Se sim, qual foi o valor da sua última Hemoglobina Glicada?',
                type: 'text',
            },
            {
                text: 'Possui algum dispositivo implantado (Marcapasso, Válvula Cardíaca, Prótese de Quadril/Joelho)?',
                type: 'text',
            },
            {
                text: 'Como você avalia sua higiene bucal de 0 a 10?',
                type: 'radio',
                options: ['1-3', '4-6', '7-8', '9-10'],
            },
            {
                text: 'Está gestante, amamentando ou em planejamento de gravidez imediata?',
                type: 'text',
            },
        ],
    },
    {
        id: 'odontopediatria_avancada',
        title: 'Odontopediatria e Hebiatria',
        description:
            'Histórico gestacional, desenvolvimento e introdução alimentar.',
        questions: [
            {
                text: 'Houve alguma intercorrência na gestação ou no parto? Fez uso de medicamentos?',
                type: 'textarea',
            },
            {
                text: 'A criança nasceu prematura? Teve febres altas ou internações nos primeiros anos de vida?',
                type: 'textarea',
            },
            {
                text: 'Hábitos de Sucção e Alimentação:',
                type: 'checkbox',
                options: [
                    'Uso de Mamadeira Noturna',
                    'Uso de Chupeta',
                    'Sucção Digital (Dedo)',
                    'Uso de Copo de Treinamento',
                    'Consumo de sucos industrializados/refrigerantes',
                ],
            },
            {
                text: 'Qual a marca e a quantidade de Flúor (PPM) do creme dental utilizado?',
                type: 'text',
            },
            {
                text: 'Como é o comportamento da criança em consultas médicas anteriores?',
                type: 'textarea',
            },
            {
                text: 'A criança sofreu alguma queda com impacto nos dentes de leite?',
                type: 'boolean',
            },
        ],
    },
];
