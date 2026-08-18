const SOURCE_REGISTRY = {
  discovery_learning: {
    title: 'Mengenal Model Pembelajaran Discovery Learning',
    publisher: 'Direktorat Guru Pendidikan Dasar',
    url: 'https://gurudikdas.kemendikdasmen.go.id/news/Mengenal-Model-Pembelajaran-Discovery-Learning',
    supports: ['model identity', 'syntax names', 'syntax order'],
    status: 'proposed'
  },
  inquiry_learning: {
    title: 'Source required for a standalone Inquiry Learning variant',
    status: 'source_required'
  },
  problem_based_learning: {
    title: 'Source required for the selected Problem Based Learning syntax variant',
    status: 'source_required'
  },
  project_based_learning: {
    title: 'Source required for the selected six-step Project Based Learning syntax variant',
    status: 'source_required'
  },
  cooperative_learning: {
    title: 'Source required for the selected Cooperative Learning variant',
    status: 'source_required'
  },
  contextual_teaching_and_learning: {
    title: 'Contextual Teaching and Learning reference',
    url: 'https://digilib.uinkhas.ac.id/28233/1/BK-CTL-Mashudi.pdf',
    supports: ['model identity', 'CTL components'],
    status: 'proposed'
  }
};

const MODEL_LIBRARY = {
  discovery_learning: {
    id: 'discovery_learning',
    name: 'Discovery Learning',
    description: 'Model pembelajaran yang menekankan penemuan konsep melalui proses eksplorasi, observasi, dan pemecahan masalah secara mandiri.',
    pedagogical_purpose: 'Mendorong peserta didik menemukan konsep, hubungan, dan prinsip melalui pengalaman dan penalaran sendiri.',
    characteristics: [
      'berbasis penemuan',
      'mengembangkan rasa ingin tahu',
      'menggunakan eksplorasi dan verifikasi',
      'mendorong keterlibatan aktif siswa'
    ],
    source_reference: {
      title: 'Discovery Learning',
      author: 'Project reference / learning model documentation',
      year: 'internal project reference',
      status: 'approved'
    },
    syntax: [
      {
        id: 'stimulation',
        order: 1,
        name: 'Stimulation',
        description: 'Guru memberikan rangsangan awal untuk memunculkan rasa ingin tahu peserta didik.',
        pedagogical_function: 'Membuka perhatian dan mengaktifkan pengetahuan awal siswa.',
        purpose: 'Mempersiapkan peserta didik agar siap terlibat dalam eksplorasi konsep.',
        input: ['apersepsi', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Menayangkan fenomena atau pertanyaan pemantik',
          'Mengaitkan materi dengan situasi yang dikenal siswa',
          'Menjelaskan konteks awal yang relevan'
        ],
        student_activity_guidance: [
          'Mengamati fenomena awal',
          'Menyampaikan pertanyaan awal',
          'Menghubungkan dengan pengetahuan sebelumnya'
        ],
        expected_output: [
          'pertanyaan awal',
          'peta pikiran awal',
          'kejelasan konteks masalah'
        ],
        next_step_dependency: [
          'Hasil pertanyaan awal menjadi dasar identifikasi masalah dan eksplorasi lebih lanjut.'
        ],
        assessment_link: [
          'partisipasi awal',
          'kejelasan pertanyaan dan respons terhadap rangsangan'
        ],
        common_mistakes: [
          'rangsangan tidak relevan',
          'guru terlalu cepat menjelaskan'
        ],
        prohibited_patterns: [
          'mengubah rangsangan menjadi narasi panjang tanpa konteks',
          'melewatkan pengetahuan awal peserta didik'
        ]
      },
      {
        id: 'problem_statement',
        order: 2,
        name: 'Problem Statement',
        description: 'Peserta didik merumuskan masalah atau hipotesis berdasarkan rangsangan awal.',
        pedagogical_function: 'Mengarahkan siswa pada fokus masalah yang akan dibahas.',
        purpose: 'Menghasilkan fokus masalah yang konkret dan dapat diselidiki.',
        input: ['pertanyaan awal', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Membimbing siswa merumuskan pertanyaan',
          'Menjaga fokus pertanyaan pada TP',
          'Mengoreksi arah rumusan masalah'
        ],
        student_activity_guidance: [
          'Merumuskan masalah',
          'Menyusun hipotesis',
          'Menentukan fokus penyelidikan'
        ],
        expected_output: [
          'rumusan masalah',
          'hipotesis',
          'fokus penyelidikan'
        ],
        next_step_dependency: [
          'Rumusan masalah menjadi acuan pengumpulan data dan penyelidikan.'
        ],
        assessment_link: [
          'kemampuan merumuskan masalah',
          'kemampuan menyusun hipotesis'
        ],
        common_mistakes: [
          'pertanyaan terlalu umum',
          'hipotesis tidak sesuai materi'
        ],
        prohibited_patterns: [
          'menggunakan pertanyaan yang tidak bisa diselidiki',
          'mengabaikan konteks materi'
        ]
      },
      {
        id: 'data_collection',
        order: 3,
        name: 'Data Collection',
        description: 'Peserta didik mengumpulkan data, informasi, atau contoh yang dibutuhkan untuk menjawab permasalahan.',
        pedagogical_function: 'Memberi ruang siswa untuk mencari bukti dan informasi terkait masalah.',
        purpose: 'Menghasilkan bukti yang dapat diolah dan dianalisis.',
        input: ['rumusan masalah', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Memberikan sumber, contoh, atau alat pendukung',
          'Memastikan data relevan dengan masalah',
          'Mengarahkan pengumpulan informasi'
        ],
        student_activity_guidance: [
          'Mengumpulkan data',
          'Mencatat informasi penting',
          'Mengorganisasi data hasil pengamatan'
        ],
        expected_output: [
          'data',
          'catatan informasi',
          'bukti empiris'
        ],
        next_step_dependency: [
          'Data yang terkumpul menjadi dasar pengolahan dan analisis.'
        ],
        assessment_link: [
          'kecermatan pengumpulan data',
          'relevansi informasi'
        ],
        common_mistakes: [
          'mengumpulkan data yang tidak relevan',
          'siswa hanya menyalin tanpa memahami'
        ],
        prohibited_patterns: [
          'mengabaikan bukti',
          'membebani siswa tanpa fokus tujuan'
        ]
      },
      {
        id: 'data_processing',
        order: 4,
        name: 'Data Processing',
        description: 'Peserta didik mengolah data dan membangun makna terhadap temuan.',
        pedagogical_function: 'Mengembangkan pemahaman dan interpretasi data.',
        purpose: 'Mengubah data mentah menjadi pemahaman konsep yang bermakna.',
        input: ['data', 'rumusan masalah'],
        teacher_activity_guidance: [
          'Membimbing analisis dan interpretasi',
          'Mengajukan pertanyaan untuk memperdalam pemahaman',
          'Memastikan logika analisis sesuai materi'
        ],
        student_activity_guidance: [
          'Menganalisis data',
          'Membandingkan bukti',
          'Menarik makna dari temuan'
        ],
        expected_output: [
          'interpretasi data',
          'analisis',
          'kesimpulan sementara'
        ],
        next_step_dependency: [
          'Hasil analisis menjadi dasar pembuktian dan generalisasi.'
        ],
        assessment_link: [
          'kemampuan menganalisis',
          'kejelasan interpretasi'
        ],
        common_mistakes: [
          'analisis terlalu dangkal',
          'tidak ada hubungan dengan masalah'
        ],
        prohibited_patterns: [
          'langsung menarik kesimpulan tanpa bukti'
        ]
      },
      {
        id: 'verification',
        order: 5,
        name: 'Verification',
        description: 'Guru dan peserta didik memeriksa validitas dan kebenaran hasil temuan.',
        pedagogical_function: 'Memastikan kesesuaian hasil analisis terhadap tujuan pembelajaran.',
        purpose: 'Mengonfirmasi bahwa pemahaman yang dibangun benar dan relevan.',
        input: ['interpretasi data', 'hipotesis'],
        teacher_activity_guidance: [
          'Menguji pemahaman siswa',
          'Memberikan umpan balik validasi',
          'Menghubungkan hasil temuan dengan TP'
        ],
        student_activity_guidance: [
          'Membuktikan hasil',
          'Menjelaskan alasan',
          'Mengambil posisi terhadap hasil analisis'
        ],
        expected_output: [
          'pembuktian',
          'kesimpulan terverifikasi',
          'evidence pemahaman'
        ],
        next_step_dependency: [
          'Hasil verifikasi menjadi dasar generalisasi dan penutupan.'
        ],
        assessment_link: [
          'kemampuan membuktikan',
          'integritas pemahaman'
        ],
        common_mistakes: [
          'validasi hanya dilakukan secara verbal tanpa bukti'
        ],
        prohibited_patterns: [
          'mengabaikan pengujian terhadap konsep'
        ]
      },
      {
        id: 'generalization',
        order: 6,
        name: 'Generalization',
        description: 'Peserta didik menarik kesimpulan umum dan mengaitkannya dengan prinsip yang berlaku secara luas.',
        pedagogical_function: 'Menyintesiskan pengetahuan menjadi prinsip umum.',
        purpose: 'Menguatkan transfer pengetahuan ke konteks yang lebih luas.',
        input: ['pembuktian', 'kesimpulan terverifikasi'],
        teacher_activity_guidance: [
          'Membimbing siswa menyusun kesimpulan umum',
          'Menghubungkan dengan materi mendasar dan TP'
        ],
        student_activity_guidance: [
          'Menarik kesimpulan',
          'Merefleksikan relevansi konsep',
          'Menghubungkan dengan situasi baru'
        ],
        expected_output: [
          'kesimpulan umum',
          'transfer pemahaman',
          'refleksi konseptual'
        ],
        next_step_dependency: [
          'Hasil generalisasi dapat menjadi landasan untuk penutup dan asesmen.'
        ],
        assessment_link: [
          'kemampuan menyimpulkan',
          'transfer konsep'
        ],
        common_mistakes: [
          'kesimpulan terlalu umum tanpa dasar'
        ],
        prohibited_patterns: [
          'mengabaikan hubungan antara hasil dengan TP'
        ]
      }
    ]
  },

  inquiry_learning: {
    id: 'inquiry_learning',
    name: 'Inquiry Learning',
    description: 'Model pembelajaran yang menuntut peserta didik mencari jawaban atas pertanyaan melalui penyelidikan dan penalaran.',
    pedagogical_purpose: 'Mengembangkan sikap kritis, rasa ingin tahu, dan kemampuan berpikir ilmiah.',
    characteristics: [
      'berbasis pertanyaan',
      'menggunakan investigasi',
      'mengutamakan proses penemuan',
      'mengembangkan keterampilan berpikir ilmiah'
    ],
    source_reference: {
      title: 'Inquiry Learning',
      author: 'Project reference / learning model documentation',
      year: 'internal project reference',
      status: 'approved'
    },
    syntax: [
      {
        id: 'orientation',
        order: 1,
        name: 'Orientation',
        description: 'Guru menyajikan konteks, pertanyaan, dan tujuan eksplorasi.',
        pedagogical_function: 'Membuka ruang penyelidikan dan membangun fokus perhatian.',
        purpose: 'Menentukan arah inquiry sesuai materi dan TP.',
        input: ['apersepsi', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Menjelaskan tujuan penyelidikan',
          'Menyampaikan pertanyaan pemantik',
          'Mengaitkan dengan konteks yang dikenal siswa'
        ],
        student_activity_guidance: [
          'Menyimak pertanyaan awal',
          'Mengidentifikasi objek penyelidikan'
        ],
        expected_output: [
          'fokus penyelidikan',
          'pertanyaan investigasi'
        ],
        next_step_dependency: [
          'Pertanyaan investigasi menjadi panduan eksplorasi.'
        ],
        assessment_link: [
          'kejelasan orientasi dan pertanyaan'
        ],
        common_mistakes: [
          'pertanyaan tidak fokus',
          'guru terlalu cepat menjelaskan'
        ],
        prohibited_patterns: [
          'pertanyaan yang tidak dapat diselidiki',
          'konteks yang tidak relevan'
        ]
      },
      {
        id: 'hypothesis',
        order: 2,
        name: 'Hypothesis',
        description: 'Peserta didik merumuskan dugaan awal yang akan diuji.',
        pedagogical_function: 'Membimbing siswa merumuskan prediksi atau dugaan awal.',
        purpose: 'Menyediakan skema penalaran yang dapat diuji.',
        input: ['pertanyaan investigasi', 'materi'],
        teacher_activity_guidance: [
          'Mengarahkan peserta didik menulis dugaan awal',
          'Menuntun agar dugaan logis dan relevan'
        ],
        student_activity_guidance: [
          'Merumuskan dugaan',
          'Menetapkan prediksi minimal'
        ],
        expected_output: [
          'hipotesis awal',
          'prediksi'
        ],
        next_step_dependency: [
          'Hipotesis menjadi dasar penyelidikan dan pembuktian.'
        ],
        assessment_link: [
          'logika prediksi dan arah pemikiran'
        ],
        common_mistakes: [
          'dugaan tidak masuk akal',
          'tidak berhubungan dengan materi'
        ],
        prohibited_patterns: [
          'menebak tanpa dasar'
        ]
      },
      {
        id: 'investigation',
        order: 3,
        name: 'Investigation',
        description: 'Peserta didik mengumpulkan bukti dan data untuk menguji hipotesis.',
        pedagogical_function: 'Mengembangkan ketelitian dan keterampilan menguji ide.',
        purpose: 'Memperoleh bukti yang dapat mendukung atau membantah dugaan awal.',
        input: ['hipotesis', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Memfasilitasi kegiatan penyelidikan',
          'Mengarahkan penggunaan sumber dan bukti'
        ],
        student_activity_guidance: [
          'Mengumpulkan data',
          'Mencatat bukti',
          'Membandingkan temuan'
        ],
        expected_output: [
          'bukti',
          'data',
          'temuan awal'
        ],
        next_step_dependency: [
          'Bukti menjadi dasar analisis hasil penyelidikan.'
        ],
        assessment_link: [
          'kemampuan mengumpulkan dan mengevaluasi bukti'
        ],
        common_mistakes: [
          'mengumpulkan data yang tidak relevan'
        ],
        prohibited_patterns: [
          'mengabaikan pembuktian'
        ]
      },
      {
        id: 'explanation',
        order: 4,
        name: 'Explanation',
        description: 'Peserta didik menjelaskan dan membahas hasil penyelidikan.',
        pedagogical_function: 'Meningkatkan pemahaman melalui argumentasi dan penjelasan.',
        purpose: 'Menyusun pemahaman yang dapat dipertanggungjawabkan.',
        input: ['data', 'temuan awal'],
        teacher_activity_guidance: [
          'Mengarahkan interpretasi data',
          'Memastikan siswa menjelaskan alasan secara logis'
        ],
        student_activity_guidance: [
          'Menjelaskan temuan',
          'Mengaitkan bukti dengan kesimpulan'
        ],
        expected_output: [
          'penjelasan logis',
          'kesimpulan sementara'
        ],
        next_step_dependency: [
          'Penjelasan menjadi dasar evaluasi dan refleksi.'
        ],
        assessment_link: [
          'kemampuan menjelaskan dan memberi argumentasi'
        ],
        common_mistakes: [
          'penjelasan tidak didukung bukti'
        ],
        prohibited_patterns: [
          'mengambil kesimpulan tanpa alasan'
        ]
      },
      {
        id: 'conclusion',
        order: 5,
        name: 'Conclusion',
        description: 'Peserta didik menarik kesimpulan dan merefleksikan proses inquiry.',
        pedagogical_function: 'Menguatkan pemahaman konseptual dan kemampuan berpikir ilmiah.',
        purpose: 'Menyimpulkan hakikat pembelajaran yang telah dicapai.',
        input: ['penjelasan logis', 'bukti'],
        teacher_activity_guidance: [
          'Membimbing refleksi',
          'Menghubungkan hasil dengan TP'
        ],
        student_activity_guidance: [
          'Menarik kesimpulan',
          'Merefleksikan proses inquiry'
        ],
        expected_output: [
          'kesimpulan',
          'refleksi',
          'evidence pemahaman'
        ],
        next_step_dependency: [
          'Kesimpulan dapat direfleksikan melalui penutup dan asesmen.'
        ],
        assessment_link: [
          'ketercapaian indikator pembelajaran'
        ],
        common_mistakes: [
          'kesimpulan tidak sesuai bukti'
        ],
        prohibited_patterns: [
          'refleksi yang tidak berhubungan dengan proses'
        ]
      }
    ]
  },

  problem_based_learning: {
    id: 'problem_based_learning',
    name: 'Problem Based Learning',
    description: 'Model pembelajaran yang memulai dari masalah autentik dan mendorong siswa memecahkan masalah secara kolaboratif.',
    pedagogical_purpose: 'Mengembangkan kemampuan berpikir kritis, analisis, dan kapasitas memecahkan masalah.',
    characteristics: [
      'berbasis masalah autentik',
      'kerja kelompok',
      'investigasi dan pemecahan masalah',
      'menggunakan bukti dan refleksi'
    ],
    source_reference: {
      title: 'Problem Based Learning',
      author: 'Project reference / learning model documentation',
      year: 'internal project reference',
      status: 'approved'
    },
    syntax: [
      {
        id: 'orientasi_masalah',
        order: 1,
        name: 'Orientasi Peserta Didik pada Masalah',
        description: 'Guru memaparkan masalah yang relevan dengan materi dan tujuan pembelajaran.',
        pedagogical_function: 'Membuka konteks dan menyiapkan siswa terhadap tugas pemecahan masalah.',
        purpose: 'Menyepakati fokus permasalahan dan kebutuhan belajar.',
        input: ['apersepsi', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Menyampaikan masalah yang autentik',
          'Menjelaskan konteks dan urgensi masalah',
          'Membimbing siswa mengamati masalah secara kritis'
        ],
        student_activity_guidance: [
          'Membaca/menyimak konteks masalah',
          'Mengidentifikasi hal yang harus diselesaikan'
        ],
        expected_output: [
          'pemahaman awal masalah',
          'pertanyaan awal'
        ],
        next_step_dependency: [
          'Pemahaman awal menjadi dasar pengorganisasian belajar.'
        ],
        assessment_link: [
          'partisipasi dalam orientasi masalah'
        ],
        common_mistakes: [
          'masalah tidak relevan',
          'orientasi terlalu singkat'
        ],
        prohibited_patterns: [
          'guru langsung memberi solusi tanpa analisis',
          'masalah tidak terkait TP'
        ]
      },
      {
        id: 'organisasi_belajar',
        order: 2,
        name: 'Mengorganisasi Peserta Didik untuk Belajar',
        description: 'Peserta didik membentuk kelompok dan menyusun strategi penyelesaian masalah.',
        pedagogical_function: 'Mengatur kerja kelompok dan fokus penyelidikan.',
        purpose: 'Menyiapkan siswa untuk bekerja secara kolaboratif dengan arah yang jelas.',
        input: ['pemahaman awal masalah'],
        teacher_activity_guidance: [
          'Mengorganisasi kelompok',
          'Menetapkan peran dan sumber belajar',
          'Membantu siswa merancang strategi penyelesaian'
        ],
        student_activity_guidance: [
          'Membagi tugas',
          'Menyusun rencana kerja',
          'Menentukan sumber atau langkah penyelidikan'
        ],
        expected_output: [
          'rencana kerja',
          'pembagian tugas',
          'strategi penyelidikan'
        ],
        next_step_dependency: [
          'Rencana kerja menjadi acuan investigasi berikutnya.'
        ],
        assessment_link: [
          'kemampuan bekerjasama dan mengorganisasi tugas'
        ],
        common_mistakes: [
          'kelompok tidak memiliki peran jelas'
        ],
        prohibited_patterns: [
          'kerja kelompok tanpa arah',
          'tidak ada pembagian tugas'
        ]
      },
      {
        id: 'bimbingan_penyelidikan',
        order: 3,
        name: 'Membimbing Penyelidikan Mandiri dan Kelompok',
        description: 'Peserta didik mengumpulkan data dan menguji solusi preliminary.',
        pedagogical_function: 'Mengembangkan kemampuan menganalisis data dan membangun solusi.',
        purpose: 'Menyediakan bukti dan landasan untuk solusi yang lebih kuat.',
        input: ['rencana kerja', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Memberikan scaffolding',
          'Menggiring siswa ke data yang relevan',
          'Memfasilitasi pertanyaan kritis'
        ],
        student_activity_guidance: [
          'Mengumpulkan data',
          'Menganalisis informasi',
          'Menilai kelayakan solusi awal'
        ],
        expected_output: [
          'data terolah',
          'solusi awal',
          'hasil analisis'
        ],
        next_step_dependency: [
          'Analisis menjadi dasar untuk penyajian dan evaluasi hasil.'
        ],
        assessment_link: [
          'kemampuan menganalisis dan menyimpulkan'
        ],
        common_mistakes: [
          'siswa hanya mencari jawaban tanpa analisis'
        ],
        prohibited_patterns: [
          'mengabaikan pembuktian dan alasan'
        ]
      },
      {
        id: 'pengembangan_hasil',
        order: 4,
        name: 'Mengembangkan dan Menyajikan Hasil Karya',
        description: 'Peserta didik menyusun karya atau laporan dan menyajikan hasilnya.',
        pedagogical_function: 'Membantu siswa mengomunikasikan hasil pemecahan masalah.',
        purpose: 'Menyampaikan hasil kerja yang bisa dipertanggungjawabkan.',
        input: ['hasil analisis', 'solusi awal'],
        teacher_activity_guidance: [
          'Mengarahkan presentasi',
          'Memberikan umpan balik' 
        ],
        student_activity_guidance: [
          'Menyusun hasil',
          'Mempresentasikan solusi',
          'Mendengar dan menanggapi masukan'
        ],
        expected_output: [
          'produk atau solusi',
          'presentasi',
          'umpan balik'
        ],
        next_step_dependency: [
          'Hasil presentasi menjadi bahan refleksi dan evaluasi.'
        ],
        assessment_link: [
          'kemampuan komunikasi dan produk'
        ],
        common_mistakes: [
          'presentasi terlalu sederhana'
        ],
        prohibited_patterns: [
          'tanpa produk atau tanpa argumentasi'
        ]
      },
      {
        id: 'evaluasi_proses',
        order: 5,
        name: 'Menganalisis dan Mengevaluasi Proses Pemecahan Masalah',
        description: 'Guru dan peserta didik merefleksikan keputusan, proses, dan hasil.',
        pedagogical_function: 'Membuat siswa mengevaluasi proses dan hasil pemecahan masalah.',
        purpose: 'Menguatkan pemahaman dan menghubungkan hasil dengan TP.',
        input: ['presentasi', 'umpan balik'],
        teacher_activity_guidance: [
          'Membantu refleksi',
          'Mengaitkan hasil dengan TP'
        ],
        student_activity_guidance: [
          'Merefleksikan proses',
          'Menyusun kesimpulan',
          'Menilai keberhasilan penyelesaian'
        ],
        expected_output: [
          'refleksi',
          'kesimpulan',
          'bukti ketercapaian'
        ],
        next_step_dependency: [
          'Hasil evaluasi menjadi dasar untuk penutup dan asesmen.'
        ],
        assessment_link: [
          'evaluasi proses dan hasil'
        ],
        common_mistakes: [
          'refleksi tidak mengarah pada tujuan pembelajaran'
        ],
        prohibited_patterns: [
          'menutup tanpa refleksi'
        ]
      }
    ]
  },

  project_based_learning: {
    id: 'project_based_learning',
    name: 'Project Based Learning',
    description: 'Model pembelajaran yang menuntut siswa merancang, mengembangkan, dan menyajikan produk dari suatu proyek yang relevan.',
    pedagogical_purpose: 'Mengembangkan kemampuan merancang, mengelola, merealisasikan, dan mengevaluasi proyek.',
    characteristics: [
      'berbasis proyek',
      'produk nyata',
      'kolaboratif',
      'menggerakkan kerja berkelanjutan'
    ],
    source_reference: {
      title: 'Project Based Learning',
      author: 'Project reference / learning model documentation',
      year: 'internal project reference',
      status: 'approved'
    },
    syntax: [
      {
        id: 'pertanyaan_mendasar',
        order: 1,
        name: 'Penentuan Pertanyaan Mendasar',
        description: 'Guru mengaitkan proyek dengan pertanyaan yang menuntun siswa merancang produk.',
        pedagogical_function: 'Menganjurkan focus proyek yang jelas dan relevan.',
        purpose: 'Menghasilkan pertanyaan utama dan arah proyek.',
        input: ['apersepsi', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Mengajukan pertanyaan pemantik',
          'Mengaitkan proyek dengan kebutuhan nyata'
        ],
        student_activity_guidance: [
          'Menyadari tujuan proyek',
          'Merumuskan pertanyaan utama'
        ],
        expected_output: [
          'pertanyaan proyek',
          'tujuan proyek'
        ],
        next_step_dependency: [
          'Pertanyaan proyek menjadi dasar rancangan dan jadwal kerja.'
        ],
        assessment_link: [
          'kejelasan tujuan proyek'
        ],
        common_mistakes: [
          'pertanyaan terlalu luas',
          'tidak relevan dengan materi'
        ],
        prohibited_patterns: [
          'proyek tanpa fokus tujuan'
        ]
      },
      {
        id: 'desain_proyek',
        order: 2,
        name: 'Mendesain Perencanaan Proyek',
        description: 'Peserta didik merancang langkah, alat, dan kriteria produk.',
        pedagogical_function: 'Menyusun proses kerja dan strategi produksi.',
        purpose: 'Menentukan alur pengerjaan proyek secara terorganisir.',
        input: ['pertanyaan proyek', 'TP', 'materi'],
        teacher_activity_guidance: [
          'Membimbing perencanaan',
          'Memastikan target proyek sesuai TP'
        ],
        student_activity_guidance: [
          'Menyusun rencana kerja',
          'Menentukan alat dan bahan',
          'Membagi tugas'
        ],
        expected_output: [
          'rencana proyek',
          'jadwal',
          'spesifikasi produk'
        ],
        next_step_dependency: [
          'Rencana proyek menjadi dasar pelaksanaan dan monitoring.'
        ],
        assessment_link: [
          'kemampuan merencanakan'
        ],
        common_mistakes: [
          'perencanaan tidak realistis'
        ],
        prohibited_patterns: [
          'langsung mengerjakan proyek tanpa perencanaan'
        ]
      },
      {
        id: 'jadwal_proyek',
        order: 3,
        name: 'Menyusun Jadwal Pelaksanaan Proyek',
        description: 'Peserta didik menetapkan jadwal dan tahapan pengerjaan.',
        pedagogical_function: 'Mengembangkan kemampuan pengelolaan waktu dan proses kerja.',
        purpose: 'Menjaga kelancaran proyek dan kualitas pengerjaan.',
        input: ['rencana proyek'],
        teacher_activity_guidance: [
          'Membimbing penjadwalan',
          'Menilai ketersediaan sumber dan waktu'
        ],
        student_activity_guidance: [
          'Menyusun timeline',
          'Menetapkan target per tahap'
        ],
        expected_output: [
          'jadwal proyek',
          'target tahap',
          'timeline kerja'
        ],
        next_step_dependency: [
          'Jadwal menjadi acuan pelaksanaan proyek.'
        ],
        assessment_link: [
          'manajemen waktu dan keteraturan kerja'
        ],
        common_mistakes: [
          'jadwal tidak realistik'
        ],
        prohibited_patterns: [
          'tanpa target atau milestone'
        ]
      },
      {
        id: 'monitor_proyek',
        order: 4,
        name: 'Memonitor Kemajuan Proyek',
        description: 'Guru memantau kemajuan, kendala, dan kualitas proses.',
        pedagogical_function: 'Membimbing serta menilai proses kerja secara berkelanjutan.',
        purpose: 'Menjaga agar proyek tetap relevan dan memenuhi target.',
        input: ['jadwal proyek', 'proses kerja'],
        teacher_activity_guidance: [
          'Memonitor kemajuan',
          'Memberikan arahan perbaikan',
          'Memastikan kualitas proses'
        ],
        student_activity_guidance: [
          'Menjalankan proyek',
          'Melaporkan kemajuan',
          'Memperbaiki hambatan'
        ],
        expected_output: [
          'produk sedang dikembangkan',
          'laporan progress',
          'perbaikan proses'
        ],
        next_step_dependency: [
          'Produk yang berkembang menjadi dasar ujian hasil dan evaluasi.'
        ],
        assessment_link: [
          'proses, perbaikan, dan kualitas pengerjaan'
        ],
        common_mistakes: [
          'monitoring tidak teratur'
        ],
        prohibited_patterns: [
          'proyek dikerjakan tanpa pengawasan'
        ]
      },
      {
        id: 'uji_hasil',
        order: 5,
        name: 'Menguji Hasil',
        description: 'Peserta didik mempresentasikan dan menguji produk yang dihasilkan.',
        pedagogical_function: 'Menilai produk berdasarkan kriteria dan bukti.',
        purpose: 'Memastikan produk memenuhi target pembelajaran.',
        input: ['produk proyek', 'laporan progress'],
        teacher_activity_guidance: [
          'Menilai produk',
          'Memberikan umpan balik',
          'Merefleksikan kualitas hasil'
        ],
        student_activity_guidance: [
          'Menyajikan hasil',
          'Menerima evaluasi',
          'Menjelaskan nilai produk'
        ],
        expected_output: [
          'hasil proyek',
          'presentasi',
          'umpan balik'
        ],
        next_step_dependency: [
          'Uji hasil menjadi dasar evaluasi pengalaman belajar.'
        ],
        assessment_link: [
          'kualitas produk dan kemampuan presentasi'
        ],
        common_mistakes: [
          'hasil tidak diuji secara valid'
        ],
        prohibited_patterns: [
          'produksi tanpa tindak lanjut evaluasi'
        ]
      },
      {
        id: 'evaluasi_pengalaman',
        order: 6,
        name: 'Evaluasi Pengalaman Belajar',
        description: 'Peserta didik menilai proses dan pengalamannya dalam mengerjakan proyek.',
        pedagogical_function: 'Mengenali pencapaian dan tantangan selama proses belajar.',
        purpose: 'Menyintesis pengalaman belajar dan kesiapan pengembangan berikutnya.',
        input: ['hasil proyek', 'umpan balik'],
        teacher_activity_guidance: [
          'Mengarahkan refleksi',
          'Menghubungkan pengalaman dengan TP'
        ],
        student_activity_guidance: [
          'Merefleksi pengalaman',
          'Menilai proses dan hasil',
          'Menentukan perbaikan berikutnya'
        ],
        expected_output: [
          'refleksi',
          'kesimpulan pengalaman',
          'evidence ketercapaian'
        ],
        next_step_dependency: [
          'Hasil evaluasi mendukung penutup dan asesmen.'
        ],
        assessment_link: [
          'refleksi, kualitas produk, dan ketercapaian TP'
        ],
        common_mistakes: [
          'refleksi tidak terkait dengan proses'
        ],
        prohibited_patterns: [
          'penutup tanpa evaluasi pengalaman'
        ]
      }
    ]
  },

  cooperative_learning: {
    id: 'cooperative_learning',
    name: 'Cooperative Learning',
    description: 'Model pembelajaran kolaboratif yang menuntut siswa bekerja sama untuk mencapai tujuan belajar bersama.',
    pedagogical_purpose: 'Mendorong interaksi sosial, tanggung jawab bersama, dan pembelajaran yang saling melengkapi.',
    characteristics: [
      'kolaboratif',
      'saling ketergantungan positif',
      'tanggung jawab individu dan kelompok',
      'diskusi dan interaksi aktif'
    ],
    source_reference: {
      title: 'Cooperative Learning',
      author: 'Project reference / learning model documentation',
      year: 'internal project reference',
      status: 'approved'
    },
    syntax: [
      {
        id: 'present_goal',
        order: 1,
        name: 'Present Goal and Task',
        description: 'Guru menyampaikan tujuan dan tugas kerja kelompok.',
        pedagogical_function: 'Menetapkan fokus kerja dan target yang harus dicapai.',
        purpose: 'Memberi arah kerja kelompok.',
        input: ['apersepsi', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Menjelaskan tujuan kelompok',
          'Menguraikan tugas dan kriteria keberhasilan'
        ],
        student_activity_guidance: [
          'Menyimak tujuan',
          'Memahami tugas dan peran'
        ],
        expected_output: [
          'tujuan kelompok',
          'pembagian tugas'
        ],
        next_step_dependency: [
          'Tujuan dan tugas menjadi dasar kerja kelompok.'
        ],
        assessment_link: [
          'pemahaman tugas dan target bersama'
        ],
        common_mistakes: [
          'tujuan tidak jelas'
        ],
        prohibited_patterns: [
          'kelompok tanpa target yang jelas'
        ]
      },
      {
        id: 'group_work',
        order: 2,
        name: 'Group Work',
        description: 'Peserta didik bekerja dalam kelompok untuk mengerjakan tugas bersama.',
        pedagogical_function: 'Mengembangkan kerja sama dan saling belajar.',
        purpose: 'Membangun hasil kerja kelompok yang terkoordinasi.',
        input: ['tujuan kelompok', 'materi'],
        teacher_activity_guidance: [
          'Membimbing kerja kelompok',
          'Mengamati pola kerja kolaboratif'
        ],
        student_activity_guidance: [
          'Berinteraksi dalam kelompok',
          'Menyelesaikan tugas bersama',
          'Memberi dukungan antar anggota'
        ],
        expected_output: [
          'hasil kerja kelompok',
          'diskusi produk',
          'kontribusi anggota'
        ],
        next_step_dependency: [
          'Hasil kerja kelompok menjadi bahan presentasi dan evaluasi.'
        ],
        assessment_link: [
          'kolaborasi dan kontribusi individu'
        ],
        common_mistakes: [
          'satu siswa mengerjakan semuanya'
        ],
        prohibited_patterns: [
          'tidak ada tanggung jawab bersama'
        ]
      },
      {
        id: 'presentation',
        order: 3,
        name: 'Presentation and Discussion',
        description: 'Kelompok menyampaikan hasil kerja dan menerima masukan dari kelompok lain.',
        pedagogical_function: 'Mengembangkan kemampuan komunikasi dan evaluasi kolektif.',
        purpose: 'Mengkonstruksi pemahaman bersama melalui diskusi.',
        input: ['hasil kerja kelompok'],
        teacher_activity_guidance: [
          'Mengarahkan diskusi',
          'Mengkonfirmasi koreksi dan kejelasan materi'
        ],
        student_activity_guidance: [
          'Mempresentasikan hasil',
          'Memberi tanggapan',
          'Membandingkan ide'
        ],
        expected_output: [
          'presentasi',
          'tanggapan',
          'perbaikan pemahaman'
        ],
        next_step_dependency: [
          'Diskusi memperkuat kesimpulan dan persiapan penutup.'
        ],
        assessment_link: [
          'kemampuan menyampaikan dan menerima masukan'
        ],
        common_mistakes: [
          'presentasi hanya membaca tanpa penjelasan'
        ],
        prohibited_patterns: [
          'diskusi tanpa fokus terhadap hasil kerja'
        ]
      },
      {
        id: 'reflection',
        order: 4,
        name: 'Reflection and Evaluation',
        description: 'Peserta didik merefleksikan proses kerja bersama dan menilai hasilnya.',
        pedagogical_function: 'Meningkatkan pemahaman atas kerja kolaboratif dan hasil yang dicapai.',
        purpose: 'Menghubungkan pengalaman kerja sama dengan tujuan pembelajaran.',
        input: ['presentasi', 'tanggapan'],
        teacher_activity_guidance: [
          'Membimbing refleksi',
          'Mengaitkan kerja sama dengan TP'
        ],
        student_activity_guidance: [
          'Merefleksi pengalaman',
          'Menilai hasil kerja kelompok'
        ],
        expected_output: [
          'refleksi',
          'kesimpulan kerja kolektif',
          'evidence ketercapaian'
        ],
        next_step_dependency: [
          'Refleksi menjadi dasar penutup dan asesmen.'
        ],
        assessment_link: [
          'refleksi proses dan hasil kerja kolaboratif'
        ],
        common_mistakes: [
          'refleksi tidak bermakna'
        ],
        prohibited_patterns: [
          'tidak mengaitkan kerja kelompok dengan TP'
        ]
      }
    ]
  },

  contextual_teaching_and_learning: {
    id: 'contextual_teaching_and_learning',
    name: 'Contextual Teaching and Learning',
    description: 'Model pembelajaran kontekstual yang menghubungkan materi dengan situasi nyata, pengalaman peserta didik, dan kebutuhan lingkungan.',
    pedagogical_purpose: 'Membantu peserta didik memahami makna materi melalui keterkaitan dengan konteks nyata.',
    characteristics: [
      'berbasis konteks nyata',
      'menghubungkan dengan pengalaman siswa',
      'menggunakan masalah kehidupan sehari-hari',
      'mendorong transfer pengetahuan'
    ],
    source_reference: {
      title: 'Contextual Teaching and Learning',
      author: 'Project reference / learning model documentation',
      year: 'internal project reference',
      status: 'approved'
    },
    syntax: [
      {
        id: 'constructivism',
        order: 1,
        name: 'Constructivism',
        description: 'Peserta didik membangun pemahaman berdasarkan pengalaman dan konteks yang mereka kenal.',
        pedagogical_function: 'Mendorong siswa membangun pengetahuan secara aktif.',
        purpose: 'Menempatkan pengalaman peserta didik sebagai basis pemahaman baru.',
        input: ['apersepsi', 'materi', 'TP'],
        teacher_activity_guidance: [
          'Menghubungkan materi dengan pengalaman realitas siswa',
          'Memancing pertanyaan dan pengamatan'
        ],
        student_activity_guidance: [
          'Membandingkan pengalaman dengan materi',
          'Mengaitkan konsep baru dengan konteks nyata'
        ],
        expected_output: [
          'pemahaman awal',
          'koneksi konteks'
        ],
        next_step_dependency: [
          'Koneksi konteks menjadi dasar aktivitas eksploratif berikutnya.'
        ],
        assessment_link: [
          'kemampuan mengaitkan materi dengan konteks nyata'
        ],
        common_mistakes: [
          'konteks terlalu abstrak'
        ],
        prohibited_patterns: [
          'mengaitkan tanpa relevansi nyata'
        ]
      },
      {
        id: 'inquiry',
        order: 2,
        name: 'Inquiry',
        description: 'Peserta didik mengeksplorasi fenomena, pertanyaan, atau situasi nyata untuk menemukan keterkaitan materi.',
        pedagogical_function: 'Menumbuhkan rasa ingin tahu dan kemampuan mencari informasi.'
        ,
        purpose: 'Membuka eksplorasi berdasarkan konteks nyata.',
        input: ['koneksi konteks', 'materi'],
        teacher_activity_guidance: [
          'Memberi fokus eksplorasi',
          'Mengarahkan membaca, pengamatan, atau wawancara singkat'
        ],
        student_activity_guidance: [
          'Mengeksplorasi fenomena',
          'Mengumpulkan informasi',
          'Mencari keterkaitan konsep'
        ],
        expected_output: [
          'data konteks',
          'temuan relevan'
        ],
        next_step_dependency: [
          'Temuan eksplorasi menjadi dasar penerapan konsep.'
        ],
        assessment_link: [
          'kemampuan mengamati dan menilai konteks'
        ],
        common_mistakes: [
          'eksplorasi tidak berhubungan dengan materi'
        ],
        prohibited_patterns: [
          'menggunakan konteks yang tidak dibahas'
        ]
      },
      {
        id: 'questioning',
        order: 3,
        name: 'Questioning',
        description: 'Guru dan siswa mengajukan pertanyaan untuk memperdalam hubungan antara materi dan dunia nyata.',
        pedagogical_function: 'Mendorong berpikir kritis dan pemahaman yang lebih dalam.',
        purpose: 'Membawa siswa ke pemahaman yang lebih akurat.',
        input: ['temuan relevan', 'materi'],
        teacher_activity_guidance: [
          'Mengajukan pertanyaan yang mengarah pada analisis',
          'Mendorong siswa bertanya' 
        ],
        student_activity_guidance: [
          'Mengajukan pertanyaan',
          'Menemukan makna yang lebih luas'
        ],
        expected_output: [
          'pertanyaan analitis',
          'pemahaman lebih luas'
        ],
        next_step_dependency: [
          'Pertanyaan analitis menjadi sumber aktivitas penerapan dan refleksi.'
        ],
        assessment_link: [
          'kemampuan bertanya dan menganalisis'
        ],
        common_mistakes: [
          'pertanyaan terlalu sederhana'
        ],
        prohibited_patterns: [
          'pertanyaan tanpa kaitan dengan materi'
        ]
      },
      {
        id: 'learning_community',
        order: 4,
        name: 'Learning Community',
        description: 'Peserta didik saling berbagi pemahaman dan pengalaman belajar.',
        pedagogical_function: 'Mengembangkan dialog dan pembelajaran bersama.',
        purpose: 'Memperluas makna melalui interaksi dengan sesama.',
        input: ['pertanyaan analitis', 'temuan relevan'],
        teacher_activity_guidance: [
          'Memfasilitasi diskusi',
          'Mengawasi kualitas interaksi'
        ],
        student_activity_guidance: [
          'Berbagi pengalaman',
          'Menyampaikan pemahaman',
          'Menanggapi pendapat lain'
        ],
        expected_output: [
          'diskusi',
          'pemahaman bersama',
          'ide baru'
        ],
        next_step_dependency: [
          'Diskusi menjadi dasar penguatan kesimpulan dan refleksi.'
        ],
        assessment_link: [
          'komunikasi dan penguatan konsep'
        ],
        common_mistakes: [
          'diskusi tidak fokus'
        ],
        prohibited_patterns: [
          'komunikasi tanpa kaitan konsep'
        ]
      },
      {
        id: 'reflection',
        order: 5,
        name: 'Reflection',
        description: 'Peserta didik merefleksikan keterkaitan materi dengan pengalaman nyata dan tujuan pembelajaran.',
        pedagogical_function: 'Memperkuat pemahaman dan transfer ke situasi baru.',
        purpose: 'Menjalin pengalaman belajar dengan makna yang lebih besar.',
        input: ['diskusi', 'pemahaman bersama'],
        teacher_activity_guidance: [
          'Memandu refleksi',
          'Menghubungkan hasil belajar dengan TP'
        ],
        student_activity_guidance: [
          'Merefleksikan pengalaman',
          'Menyusun kesimpulan',
          'Menilai manfaat pemahaman'
        ],
        expected_output: [
          'refleksi',
          'kesimpulan kontekstual',
          'evidence pemahaman'
        ],
        next_step_dependency: [
          'Refleksi mempersiapkan penutup dan asesmen.'
        ],
        assessment_link: [
          'hubungan materi dan penerapan dalam konteks nyata'
        ],
        common_mistakes: [
          'refleksi terlalu umum'
        ],
        prohibited_patterns: [
          'tanpa hubungan dengan konteks materi'
        ]
      }
    ]
  }
};

const MODEL_INVENTORY = Object.values(MODEL_LIBRARY).map(model => ({
  id: model.id,
  name: model.name,
  description: model.description,
  pedagogical_purpose: model.pedagogical_purpose,
  characteristics: model.characteristics,
  source_reference: SOURCE_REGISTRY[model.id] || { status: 'source_required' },
  syntax_count: model.syntax.length
}));

module.exports = {
  SOURCE_REGISTRY,
  MODEL_LIBRARY,
  MODEL_INVENTORY
};
