require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Question = require('../models/Question');
const Result = require('../models/Result');

const categoriesData = [
  {
    name: 'Web Development',
    description: 'HTML5, CSS3, Responsive Design, and Modern Web Architecture fundamentals.',
    difficulty: 'Easy',
    status: 'active'
  },
  {
    name: 'JavaScript',
    description: 'Core JavaScript mechanics, ES6+ features, closures, promises, and the event loop.',
    difficulty: 'Medium',
    status: 'active'
  },
  {
    name: 'Python',
    description: 'Python syntax, data structures, object-oriented concepts, and standard library idioms.',
    difficulty: 'Medium',
    status: 'active'
  },
  {
    name: 'Data Science',
    description: 'Statistics, data preprocessing, machine learning algorithms, and evaluation metrics.',
    difficulty: 'Hard',
    status: 'active'
  },
  {
    name: 'General Knowledge',
    description: 'World history, geography, science discoveries, and cultural trivia.',
    difficulty: 'Easy',
    status: 'active'
  },
  {
    name: 'Computer Networks',
    description: 'OSI model, TCP/IP protocol suite, network routing, DNS, and transport layer mechanics.',
    difficulty: 'Medium',
    status: 'active'
  }
];

const questionsData = {
  'Web Development': [
    {
      questionText: 'What does HTML stand for?',
      options: [
        { text: 'Hyper Text Markup Language' },
        { text: 'High Tech Modern Language' },
        { text: 'Hyper Transfer Markup Language' },
        { text: 'Home Tool Markup Language' }
      ],
      correctAnswer: 0,
      explanation: 'HTML stands for HyperText Markup Language, the standard markup language for documents designed to be displayed in a web browser.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which CSS property is used to create space outside of an element\'s border?',
      options: [
        { text: 'padding' },
        { text: 'margin' },
        { text: 'border-spacing' },
        { text: 'outline' }
      ],
      correctAnswer: 1,
      explanation: 'Margin generates space around elements, outside of any defined borders, whereas padding generates space inside an element\'s border.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which HTTP status code signifies that a requested resource was not found on the server?',
      options: [
        { text: '200 OK' },
        { text: '301 Moved Permanently' },
        { text: '404 Not Found' },
        { text: '500 Internal Server Error' }
      ],
      correctAnswer: 2,
      explanation: 'The 404 Not Found client error status code indicates that the server cannot find the requested resource.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What does the "S" in HTTPS stand for?',
      options: [
        { text: 'Standard' },
        { text: 'Secure' },
        { text: 'Speed' },
        { text: 'Socket' }
      ],
      correctAnswer: 1,
      explanation: 'HTTPS stands for Hypertext Transfer Protocol Secure, which encrypts data transfers using TLS/SSL.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which HTML element is used to define or embed client-side JavaScript code?',
      options: [
        { text: '<js>' },
        { text: '<javascript>' },
        { text: '<script>' },
        { text: '<code>' }
      ],
      correctAnswer: 2,
      explanation: 'The <script> element is used to embed executable client-side scripts such as JavaScript.',
      difficulty: 'Easy'
    },
    {
      questionText: 'In CSS Flexbox, which property aligns flex items along the main axis?',
      options: [
        { text: 'align-items' },
        { text: 'justify-content' },
        { text: 'align-content' },
        { text: 'flex-direction' }
      ],
      correctAnswer: 1,
      explanation: 'justify-content defines the alignment along the main axis of the current flex container line.',
      difficulty: 'Medium'
    },
    {
      questionText: 'Which semantic HTML5 element represents the primary navigation links of a page?',
      options: [
        { text: '<menu>' },
        { text: '<nav>' },
        { text: '<header>' },
        { text: '<section>' }
      ],
      correctAnswer: 1,
      explanation: 'The <nav> element is intended for major navigation blocks with links pointing to other pages or page sections.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What is the primary role of responsive web design (RWD)?',
      options: [
        { text: 'To ensure server-side database synchronization' },
        { text: 'To adapt web layouts gracefully across different devices and screen sizes' },
        { text: 'To compress multimedia files automatically' },
        { text: 'To enforce strict browser sandboxing security' }
      ],
      correctAnswer: 1,
      explanation: 'Responsive design utilizes flexible layouts, responsive images, and CSS media queries to deliver an optimal viewing experience across diverse screen resolutions.',
      difficulty: 'Medium'
    }
  ],
  'JavaScript': [
    {
      questionText: 'Which keyword declares a block-scoped variable in modern JavaScript (ES6+)?',
      options: [
        { text: 'var' },
        { text: 'let' },
        { text: 'define' },
        { text: 'global' }
      ],
      correctAnswer: 1,
      explanation: 'let and const declare block-scoped variables, unlike var which is function-scoped or global.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What is the evaluated output of typeof null in JavaScript?',
      options: [
        { text: '"null"' },
        { text: '"undefined"' },
        { text: '"object"' },
        { text: '"boolean"' }
      ],
      correctAnswer: 2,
      explanation: 'In JavaScript, typeof null returns "object", a known legacy artifact from the original 1995 JavaScript implementation.',
      difficulty: 'Medium'
    },
    {
      questionText: 'What does the Array.prototype.map() method return?',
      options: [
        { text: 'The modified original array mutated in place' },
        { text: 'A new array populated with the results of calling a provided function on every element' },
        { text: 'The first element that matches a test condition' },
        { text: 'The length of the processed array' }
      ],
      correctAnswer: 1,
      explanation: 'Array.prototype.map() creates a brand new array populated with the results of applying the callback function to each array item.',
      difficulty: 'Medium'
    },
    {
      questionText: 'What will 0 == "0" and 0 === "0" evaluate to in JavaScript?',
      options: [
        { text: 'true and true' },
        { text: 'false and false' },
        { text: 'true and false' },
        { text: 'false and true' }
      ],
      correctAnswer: 2,
      explanation: 'Loose equality (==) coerces string "0" to number 0 (true), while strict equality (===) rejects mismatched types without coercion (false).',
      difficulty: 'Medium'
    },
    {
      questionText: 'What does a JavaScript Promise represent?',
      options: [
        { text: 'A synchronous multi-threaded execution block' },
        { text: 'The eventual completion or failure of an asynchronous operation and its resulting value' },
        { text: 'A guaranteed allocation of browser heap memory' },
        { text: 'A direct TCP socket connection to a backend server' }
      ],
      correctAnswer: 1,
      explanation: 'A Promise is a proxy for a value not necessarily known when the promise is created, handling asynchronous events.',
      difficulty: 'Medium'
    },
    {
      questionText: 'Which built-in JSON method serializes a JavaScript object into a JSON string?',
      options: [
        { text: 'JSON.parse()' },
        { text: 'JSON.stringify()' },
        { text: 'JSON.toObject()' },
        { text: 'JSON.encode()' }
      ],
      correctAnswer: 1,
      explanation: 'JSON.stringify() converts a JavaScript object or primitive value into a formatted JSON string.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What is a closure in JavaScript?',
      options: [
        { text: 'A function bundled together with references to its surrounding lexical environment' },
        { text: 'A statement that forcefully terminates an active event loop' },
        { text: 'A syntax construct used exclusively to freeze object properties' },
        { text: 'A garbage collection trigger for unreferenced variables' }
      ],
      correctAnswer: 0,
      explanation: 'A closure gives an inner function access to an outer function’s scope even after the outer function has finished executing.',
      difficulty: 'Hard'
    },
    {
      questionText: 'Which event loop component executes Promise callbacks (.then, .catch, .finally)?',
      options: [
        { text: 'Macrotask queue' },
        { text: 'Microtask queue' },
        { text: 'Rendering pipeline' },
        { text: 'I/O polling thread' }
      ],
      correctAnswer: 1,
      explanation: 'Promise reactions and queueMicrotask callbacks are queued in the microtask queue, which is drained immediately after the current synchronous script runs.',
      difficulty: 'Hard'
    }
  ],
  'Python': [
    {
      questionText: 'Which keyword is used to declare a function in Python?',
      options: [
        { text: 'function' },
        { text: 'def' },
        { text: 'fun' },
        { text: 'fn' }
      ],
      correctAnswer: 1,
      explanation: 'Python uses the "def" keyword to define functions.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which of the following built-in collection types in Python is immutable?',
      options: [
        { text: 'list' },
        { text: 'dict' },
        { text: 'set' },
        { text: 'tuple' }
      ],
      correctAnswer: 3,
      explanation: 'Tuples are immutable; once instantiated, their elements cannot be altered or reassigned.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What is the output of len([1, [2, 3], 4]) in Python?',
      options: [
        { text: '4' },
        { text: '3' },
        { text: '2' },
        { text: '5' }
      ],
      correctAnswer: 1,
      explanation: 'The outer list has 3 items: the integer 1, the list [2, 3], and the integer 4.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which block structure is used for handling exceptions in Python?',
      options: [
        { text: 'try / catch' },
        { text: 'try / except' },
        { text: 'try / handle' },
        { text: 'catch / rescue' }
      ],
      correctAnswer: 1,
      explanation: 'Python uses "try / except" blocks for handling exceptions and errors.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What is PEP 8 in the Python ecosystem?',
      options: [
        { text: 'The official Style Guide for Python Code' },
        { text: 'A compiler optimization standard' },
        { text: 'A package dependency manager' },
        { text: 'A high-performance C-extension specification' }
      ],
      correctAnswer: 0,
      explanation: 'PEP 8 provides guidelines and best practices on how to format and write clean, readable Python code.',
      difficulty: 'Medium'
    },
    {
      questionText: 'What is the primary purpose of the __init__ method in a Python class?',
      options: [
        { text: 'It acts as an instance destructor' },
        { text: 'It serves as the object constructor/initializer' },
        { text: 'It serializes the object to JSON' },
        { text: 'It compiles class methods to bytecode' }
      ],
      correctAnswer: 1,
      explanation: '__init__ is automatically called when a new instance of a class is created to initialize its attributes.',
      difficulty: 'Medium'
    },
    {
      questionText: 'What does the range(2, 10, 2) generator produce in Python 3?',
      options: [
        { text: '2, 4, 6, 8, 10' },
        { text: '2, 4, 6, 8' },
        { text: '2, 3, 4, 5, 6, 7, 8, 9' },
        { text: '4, 6, 8, 10' }
      ],
      correctAnswer: 1,
      explanation: 'range(start, stop, step) starts at 2, increments by 2, and stops before reaching 10: producing 2, 4, 6, and 8.',
      difficulty: 'Medium'
    },
    {
      questionText: 'Which statement ensures files are properly closed after operations, even if an exception occurs?',
      options: [
        { text: 'file.auto_close()' },
        { text: 'with open(...) as f:' },
        { text: 'open.finally(...)' },
        { text: 'using open(...)' }
      ],
      correctAnswer: 1,
      explanation: 'The "with" statement creates a context manager that guarantees proper release of resources like file descriptors.',
      difficulty: 'Medium'
    }
  ],
  'Data Science': [
    {
      questionText: 'Which Python library provides high-performance DataFrame data structures for tabular data manipulation?',
      options: [
        { text: 'NumPy' },
        { text: 'Pandas' },
        { text: 'Matplotlib' },
        { text: 'Scipy' }
      ],
      correctAnswer: 1,
      explanation: 'Pandas is the leading library for structured data manipulation, analysis, and data cleaning in Python.',
      difficulty: 'Medium'
    },
    {
      questionText: 'In machine learning, what does "overfitting" mean?',
      options: [
        { text: 'The model performs exceptionally on training data but generalizes poorly to unseen data' },
        { text: 'The model has too few parameters to capture the underlying pattern' },
        { text: 'The model requires too much GPU RAM to train' },
        { text: 'The dataset has fewer samples than features' }
      ],
      correctAnswer: 0,
      explanation: 'Overfitting occurs when a model learns the detailed noise and peculiarities of the training dataset rather than the general pattern.',
      difficulty: 'Medium'
    },
    {
      questionText: 'Which metric is best suited for evaluating a binary classification model on a highly imbalanced dataset (e.g. 99% class 0, 1% class 1)?',
      options: [
        { text: 'Accuracy' },
        { text: 'F1-Score / Precision-Recall AUC' },
        { text: 'Mean Squared Error' },
        { text: 'R-Squared' }
      ],
      correctAnswer: 1,
      explanation: 'Accuracy on imbalanced data is misleading (a naive model predicting all 0 gets 99% accuracy). F1-Score and PR-AUC assess precision and recall accurately.',
      difficulty: 'Hard'
    },
    {
      questionText: 'What is the primary function of Principal Component Analysis (PCA)?',
      options: [
        { text: 'Supervised classification of categorical labels' },
        { text: 'Dimensionality reduction while preserving maximal data variance' },
        { text: 'Calculating text sentiment scores' },
        { text: 'Clustering unlabelled points based on density' }
      ],
      correctAnswer: 1,
      explanation: 'PCA transforms high-dimensional correlated features into a smaller set of orthogonal, uncorrelated components explaining the most variance.',
      difficulty: 'Hard'
    },
    {
      questionText: 'What is the possible range of Pearson\'s correlation coefficient (r)?',
      options: [
        { text: '0 to 1' },
        { text: '-1 to +1' },
        { text: '-Infinity to +Infinity' },
        { text: '0 to 100' }
      ],
      correctAnswer: 1,
      explanation: 'Pearson’s r ranges from -1 (perfect negative linear correlation) through 0 (no linear correlation) to +1 (perfect positive linear correlation).',
      difficulty: 'Medium'
    },
    {
      questionText: 'What is the core purpose of an activation function in deep neural networks?',
      options: [
        { text: 'To compress model weights into smaller files' },
        { text: 'To introduce non-linearity, enabling learning of complex non-linear relationships' },
        { text: 'To enforce gradient clipping during backpropagation' },
        { text: 'To encrypt weights for privacy' }
      ],
      correctAnswer: 1,
      explanation: 'Without non-linear activation functions (like ReLU, GELU, Sigmoid), stacking layers would simply collapse into a single linear transformation.',
      difficulty: 'Hard'
    },
    {
      questionText: 'What are the target mean and standard deviation of data after Z-score standardization?',
      options: [
        { text: 'Mean = 0, Standard Deviation = 1' },
        { text: 'Mean = 1, Standard Deviation = 0' },
        { text: 'Mean = 0.5, Standard Deviation = 0.5' },
        { text: 'Mean = 100, Standard Deviation = 15' }
      ],
      correctAnswer: 0,
      explanation: 'Standardization centers the data around a mean of 0 with a unit standard deviation of 1.',
      difficulty: 'Medium'
    },
    {
      questionText: 'Which algorithm combines multiple decision trees using bootstrap aggregating (bagging)?',
      options: [
        { text: 'K-Means' },
        { text: 'Random Forest' },
        { text: 'Support Vector Machine' },
        { text: 'Logistic Regression' }
      ],
      correctAnswer: 1,
      explanation: 'Random Forest builds multiple decision trees on random subsets of data and features, combining their votes to improve accuracy and control overfitting.',
      difficulty: 'Hard'
    }
  ],
  'General Knowledge': [
    {
      questionText: 'What is the capital city of Australia?',
      options: [
        { text: 'Sydney' },
        { text: 'Melbourne' },
        { text: 'Canberra' },
        { text: 'Brisbane' }
      ],
      correctAnswer: 2,
      explanation: 'Canberra was chosen as the compromise capital of Australia in 1908 between rivals Sydney and Melbourne.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which chemical element is represented by the symbol "Au"?',
      options: [
        { text: 'Silver' },
        { text: 'Gold' },
        { text: 'Argon' },
        { text: 'Aluminum' }
      ],
      correctAnswer: 1,
      explanation: 'The chemical symbol Au comes from the Latin word "aurum", meaning gold.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which planet in our solar system is nicknamed the "Red Planet"?',
      options: [
        { text: 'Venus' },
        { text: 'Jupiter' },
        { text: 'Mars' },
        { text: 'Mercury' }
      ],
      correctAnswer: 2,
      explanation: 'Mars appears red to observers due to the oxidation of iron minerals (rust) on its surface.',
      difficulty: 'Easy'
    },
    {
      questionText: 'In which year did the Apollo 11 mission first land humans on the Moon?',
      options: [
        { text: '1965' },
        { text: '1969' },
        { text: '1972' },
        { text: '1961' }
      ],
      correctAnswer: 1,
      explanation: 'Neil Armstrong and Buzz Aldrin stepped onto the Moon on July 20, 1969.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Who painted the celebrated masterpiece "Mona Lisa"?',
      options: [
        { text: 'Michelangelo' },
        { text: 'Leonardo da Vinci' },
        { text: 'Raphael' },
        { text: 'Vincent van Gogh' }
      ],
      correctAnswer: 1,
      explanation: 'The Mona Lisa was painted by Italian polymath Leonardo da Vinci in the early 16th century.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which is the largest ocean on Earth by surface area?',
      options: [
        { text: 'Atlantic Ocean' },
        { text: 'Indian Ocean' },
        { text: 'Pacific Ocean' },
        { text: 'Southern Ocean' }
      ],
      correctAnswer: 2,
      explanation: 'The Pacific Ocean covers approximately 165 million square kilometers, encompassing more than 30% of Earth\'s surface.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What is the hardest naturally occurring mineral known on Earth?',
      options: [
        { text: 'Quartz' },
        { text: 'Topaz' },
        { text: 'Corundum' },
        { text: 'Diamond' }
      ],
      correctAnswer: 3,
      explanation: 'Diamond holds the top rating of 10 on the Mohs hardness scale.',
      difficulty: 'Easy'
    },
    {
      questionText: 'Which country is historically referred to as the "Land of the Rising Sun"?',
      options: [
        { text: 'China' },
        { text: 'South Korea' },
        { text: 'Japan' },
        { text: 'Vietnam' }
      ],
      correctAnswer: 2,
      explanation: 'Japan\'s native name "Nihon" or "Nippon" literally translates to "source/origin of the sun".',
      difficulty: 'Easy'
    }
  ],
  'Computer Networks': [
    {
      questionText: 'At which layer of the OSI model does the Internet Protocol (IP) operate?',
      options: [
        { text: 'Data Link Layer (Layer 2)' },
        { text: 'Network Layer (Layer 3)' },
        { text: 'Transport Layer (Layer 4)' },
        { text: 'Session Layer (Layer 5)' }
      ],
      correctAnswer: 1,
      explanation: 'The Internet Protocol (IP) provides packet routing and addressing at Layer 3 (Network Layer) of the OSI model.',
      difficulty: 'Medium'
    },
    {
      questionText: 'Which network protocol translates human-readable domain names (e.g. quizora.com) into IP addresses?',
      options: [
        { text: 'DHCP' },
        { text: 'DNS' },
        { text: 'SNMP' },
        { text: 'ARP' }
      ],
      correctAnswer: 1,
      explanation: 'DNS (Domain Name System) maintains a distributed directory mapping domain names to numerical IP addresses.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What is the default TCP port number reserved for secure HTTPS web traffic?',
      options: [
        { text: '80' },
        { text: '21' },
        { text: '443' },
        { text: '8080' }
      ],
      correctAnswer: 2,
      explanation: 'Port 443 is assigned by IANA for standard encrypted HTTPS web communications.',
      difficulty: 'Easy'
    },
    {
      questionText: 'What is a fundamental difference between TCP and UDP?',
      options: [
        { text: 'TCP is connection-oriented and guarantees delivery; UDP is connectionless and prioritizes low latency' },
        { text: 'TCP is wireless only, while UDP requires wired Ethernet' },
        { text: 'UDP cannot transmit media files' },
        { text: 'TCP headers are smaller than UDP headers' }
      ],
      correctAnswer: 0,
      explanation: 'TCP includes handshakes, sequence numbers, and retransmissions for reliable delivery, while UDP sends datagrams without state or retransmissions.',
      difficulty: 'Medium'
    },
    {
      questionText: 'How many bits make up an IPv4 address?',
      options: [
        { text: '16 bits' },
        { text: '32 bits' },
        { text: '64 bits' },
        { text: '128 bits' }
      ],
      correctAnswer: 1,
      explanation: 'An IPv4 address consists of 32 bits divided into 4 eight-bit octets. IPv6 uses 128 bits.',
      difficulty: 'Medium'
    },
    {
      questionText: 'What is the function of the Address Resolution Protocol (ARP)?',
      options: [
        { text: 'Resolves IP addresses (Layer 3) to physical MAC addresses (Layer 2) on a local subnet' },
        { text: 'Assigns dynamic IP addresses to workstations' },
        { text: 'Encrypts payload data across public internet hops' },
        { text: 'Synchronizes network clocks' }
      ],
      correctAnswer: 0,
      explanation: 'ARP enables hosts to discover the hardware MAC address associated with a given target IP address within a broadcast domain.',
      difficulty: 'Medium'
    },
    {
      questionText: 'Which network device inspects incoming packets and forwards them across separate network boundaries using routing tables?',
      options: [
        { text: 'Hub' },
        { text: 'Unmanaged Switch' },
        { text: 'Router' },
        { text: 'Repeater' }
      ],
      correctAnswer: 2,
      explanation: 'Routers operate at Layer 3 to determine optimal packet paths and route packets between distinct IP subnets.',
      difficulty: 'Medium'
    },
    {
      questionText: 'What is the correct 3-step packet handshake sequence to establish a TCP connection?',
      options: [
        { text: 'SYN -> SYN-ACK -> ACK' },
        { text: 'ACK -> SYN -> ACK' },
        { text: 'HELLO -> VERIFY -> CONNECT' },
        { text: 'FIN -> ACK -> RST' }
      ],
      correctAnswer: 0,
      explanation: 'The TCP three-way handshake initiates with client SYN, server replies with SYN-ACK, and client finishes with ACK.',
      difficulty: 'Medium'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('\n==========================================');
    console.log('  🌱 QUIZORA DATABASE SEED SCRIPT STARTING');
    console.log('==========================================\n');

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizora';
    console.log(`📡 Connecting to MongoDB at: ${mongoUri}`);

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully.\n');

    // 1. Clear existing collections
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Question.deleteMany({}),
      Result.deleteMany({})
    ]);
    console.log('✅ Collections cleared.\n');

    // 2. Create Admin user
    console.log('👤 Creating Admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@quizora.com',
      password: 'Admin@123',
      role: 'admin'
    });
    console.log(`✅ Admin created: ${admin.email} (Role: ${admin.role})`);

    // 3. Create Sample users
    console.log('👥 Creating sample users...');
    const user1 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@quizora.com',
      password: 'Password@123',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Alex Mercer',
      email: 'alex@quizora.com',
      password: 'Password@123',
      role: 'user'
    });
    console.log(`✅ User 1 created: ${user1.name} (${user1.email})`);
    console.log(`✅ User 2 created: ${user2.name} (${user2.email})\n`);

    // 4. Create Categories & Questions
    console.log('📚 Creating categories and questions...');
    const createdCategories = {};
    const createdQuestions = {};
    let totalQuestionsCount = 0;

    for (const catData of categoriesData) {
      const category = await Category.create(catData);
      createdCategories[category.name] = category;
      createdQuestions[category.name] = [];

      const rawQuestions = questionsData[category.name] || [];
      for (const qData of rawQuestions) {
        const question = await Question.create({
          categoryId: category._id,
          questionText: qData.questionText,
          options: qData.options,
          correctAnswer: qData.correctAnswer,
          explanation: qData.explanation,
          difficulty: qData.difficulty
        });
        createdQuestions[category.name].push(question);
        totalQuestionsCount++;
      }

      // Update questionCount in Category
      category.questionCount = rawQuestions.length;
      await category.save();
      console.log(`   📂 [${category.name}]: ${rawQuestions.length} questions created.`);
    }

    console.log(`\n✅ ${categoriesData.length} categories and ${totalQuestionsCount} questions created.\n`);

    // 5. Create Sample Quiz Results
    console.log('🏆 Creating sample quiz results for leaderboard and statistics...');
    const webDevQuestions = createdQuestions['Web Development'];
    const jsQuestions = createdQuestions['JavaScript'];
    const pyQuestions = createdQuestions['Python'];

    // Sarah results: Web Dev (8/8 = 100%)
    const sarahAnswers1 = webDevQuestions.map(q => ({
      questionId: q._id,
      selectedAnswer: q.correctAnswer,
      isCorrect: true
    }));

    await Result.create({
      userId: user1._id,
      categoryId: createdCategories['Web Development']._id,
      score: 8,
      totalQuestions: 8,
      percentage: 100,
      answers: sarahAnswers1,
      timeTaken: 125,
      submittedAt: new Date(Date.now() - 3600 * 1000 * 24)
    });

    // Sarah results: JavaScript (7/8 = 87.5%)
    const sarahAnswers2 = jsQuestions.map((q, idx) => ({
      questionId: q._id,
      selectedAnswer: idx === 3 ? (q.correctAnswer + 1) % 4 : q.correctAnswer,
      isCorrect: idx !== 3
    }));

    await Result.create({
      userId: user1._id,
      categoryId: createdCategories['JavaScript']._id,
      score: 7,
      totalQuestions: 8,
      percentage: 87.5,
      answers: sarahAnswers2,
      timeTaken: 190,
      submittedAt: new Date(Date.now() - 3600 * 1000 * 12)
    });

    // Alex results: JavaScript (6/8 = 75%)
    const alexAnswers1 = jsQuestions.map((q, idx) => ({
      questionId: q._id,
      selectedAnswer: (idx === 1 || idx === 5) ? (q.correctAnswer + 1) % 4 : q.correctAnswer,
      isCorrect: idx !== 1 && idx !== 5
    }));

    await Result.create({
      userId: user2._id,
      categoryId: createdCategories['JavaScript']._id,
      score: 6,
      totalQuestions: 8,
      percentage: 75,
      answers: alexAnswers1,
      timeTaken: 240,
      submittedAt: new Date(Date.now() - 3600 * 1000 * 6)
    });

    // Alex results: Python (8/8 = 100%)
    const alexAnswers2 = pyQuestions.map(q => ({
      questionId: q._id,
      selectedAnswer: q.correctAnswer,
      isCorrect: true
    }));

    await Result.create({
      userId: user2._id,
      categoryId: createdCategories['Python']._id,
      score: 8,
      totalQuestions: 8,
      percentage: 100,
      answers: alexAnswers2,
      timeTaken: 155,
      submittedAt: new Date(Date.now() - 3600 * 1000 * 2)
    });

    console.log('✅ Sample results created.');

    console.log('\n==========================================');
    console.log('  🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('==========================================');
    console.log(`  Users:      3 (1 Admin, 2 Students)`);
    console.log(`  Categories: ${categoriesData.length}`);
    console.log(`  Questions:  ${totalQuestionsCount}`);
    console.log(`  Results:    4 sample quiz submissions`);
    console.log('------------------------------------------');
    console.log('  Admin Credentials:');
    console.log('  Email:    admin@quizora.com');
    console.log('  Password: Admin@123');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
