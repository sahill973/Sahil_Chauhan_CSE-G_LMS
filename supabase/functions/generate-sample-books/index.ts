
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Database of books organized by department
const departmentBooks = {
  "School of Engineering and Technology (SOET)": [
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", description: "A comprehensive guide to understanding algorithms in computer science." },
    { title: "Clean Code", author: "Robert C. Martin", description: "A handbook of agile software craftsmanship that emphasizes writing clean, maintainable code." },
    { title: "Design Patterns", author: "Erich Gamma", description: "Elements of Reusable Object-Oriented Software that presents patterns for software design." },
    { title: "Computer Networks", author: "Andrew S. Tanenbaum", description: "A comprehensive introduction to computer networks and their protocols." },
    { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", description: "The leading textbook in Artificial Intelligence used globally." },
    { title: "Database System Concepts", author: "Abraham Silberschatz", description: "An introduction to database system concepts and architecture." },
    { title: "Operating System Concepts", author: "Abraham Silberschatz", description: "A guide to understanding operating systems principles and practice." },
    { title: "Software Engineering", author: "Ian Sommerville", description: "A comprehensive guide to software engineering principles and practices." },
    { title: "Digital Design", author: "M. Morris Mano", description: "A textbook for digital logic and computer design." },
    { title: "The Pragmatic Programmer", author: "Andrew Hunt", description: "Journey to mastery in the programming profession." }
  ],
  "School of Management and Commerce (SOMC)": [
    { title: "Principles of Marketing", author: "Philip Kotler", description: "The classic marketing textbook that explores core marketing concepts." },
    { title: "Financial Management", author: "Prasanna Chandra", description: "A comprehensive guide to financial management principles." },
    { title: "Organizational Behavior", author: "Stephen P. Robbins", description: "Understanding and managing people in organizations." },
    { title: "Business Research Methods", author: "Donald R. Cooper", description: "Guide to conducting business research with quantitative and qualitative methods." },
    { title: "Strategic Management", author: "A. A. Thompson", description: "Concepts and cases in strategic management for business students." },
    { title: "International Business", author: "Charles W. L. Hill", description: "Understanding global business operations and strategies." },
    { title: "Cost Accounting", author: "Charles T. Horngren", description: "A managerial emphasis on cost accounting principles." },
    { title: "Supply Chain Management", author: "Sunil Chopra", description: "Strategy, planning, and operation of supply chains." },
    { title: "Investment Analysis", author: "Frank K. Reilly", description: "Portfolio management and security analysis for investments." },
    { title: "Entrepreneurship", author: "Robert D. Hisrich", description: "Starting and growing new ventures in the business world." }
  ],
  "School of Law (SOL)": [
    { title: "Introduction to Indian Constitution", author: "Durga Das Basu", description: "A comprehensive introduction to the Indian Constitution." },
    { title: "Law of Contracts", author: "Avtar Singh", description: "A comprehensive guide to contract law principles and practice." },
    { title: "Criminal Law", author: "K. D. Gaur", description: "Textbook on Indian criminal law and procedures." },
    { title: "Law of Torts", author: "R. K. Bangia", description: "Principles and cases in tort law for legal studies." },
    { title: "Environmental Law", author: "P. Leelakrishnan", description: "Legal frameworks for environmental protection and sustainability." },
    { title: "Legal Ethics", author: "S. P. Sathe", description: "Professional responsibility and ethics in legal practice." },
    { title: "Intellectual Property Rights", author: "V. K. Ahuja", description: "Introduction to copyright, patents, trademarks and other IP rights." },
    { title: "Family Law", author: "Paras Diwan", description: "Personal laws including marriage, divorce, and inheritance." },
    { title: "Company Law", author: "Avtar Singh", description: "Legal aspects of corporate formation, governance, and dissolution." },
    { title: "Law of Evidence", author: "Batuk Lal", description: "Rules and principles governing admissibility of evidence in court." }
  ],
  "School of Humanities and Social Sciences (SHSS)": [
    { title: "Social Psychology", author: "David G. Myers", description: "Exploring how thoughts, feelings, and behaviors are influenced by others." },
    { title: "Cultural Anthropology", author: "Conrad P. Kottak", description: "Understanding human diversity through cultural frameworks." },
    { title: "Political Theory", author: "Andrew Heywood", description: "Introduction to key concepts and ideologies in political science." },
    { title: "Sociology: A Brief Introduction", author: "Richard T. Schaefer", description: "Fundamental concepts in the study of human society." },
    { title: "History of Modern India", author: "Bipan Chandra", description: "India's journey from colonialism to independence." },
    { title: "Introduction to Philosophy", author: "John Perry", description: "Exploring fundamental questions of existence, knowledge, ethics, and reality." },
    { title: "Literary Criticism", author: "M. A. R. Habib", description: "Theory and practice in analyzing and interpreting literature." },
    { title: "Research Methodology", author: "C. R. Kothari", description: "Methods and techniques for social science research." },
    { title: "Public Administration", author: "Nicholas Henry", description: "Principles and practices of government management and administration." },
    { title: "Environmental Ethics", author: "Joseph R. Des Jardins", description: "Moral relationships between humans and the natural environment." }
  ],
  "School of Sciences (SOS)": [
    { title: "Fundamentals of Physics", author: "Halliday and Resnick", description: "Comprehensive introduction to principles of physics." },
    { title: "Organic Chemistry", author: "Morrison and Boyd", description: "Classic textbook covering structure and reactions in organic chemistry." },
    { title: "Molecular Biology of the Cell", author: "Bruce Alberts", description: "Detailed guide to cellular molecular mechanisms." },
    { title: "Calculus", author: "James Stewart", description: "Comprehensive guide to differential and integral calculus." },
    { title: "Inorganic Chemistry", author: "J. D. Lee", description: "Concise textbook on inorganic chemistry principles." },
    { title: "Principles of Biochemistry", author: "Lehninger", description: "Fundamental concepts in biochemistry and molecular biology." },
    { title: "Genetics", author: "Peter J. Russell", description: "Introduction to classical and molecular genetics." },
    { title: "Ecology", author: "Eugene P. Odum", description: "Fundamentals of ecology and environmental science." },
    { title: "Analytical Chemistry", author: "Skoog and West", description: "Principles of analytical methods and instrumentation." },
    { title: "Statistics for Scientists", author: "Martin Bland", description: "Statistical methods for scientific research." }
  ],
  "School of Computer Applications (SOCA)": [
    { title: "Data Structures and Algorithms", author: "Narasimha Karumanchi", description: "Implementation of data structures and algorithms in programming." },
    { title: "Database Management Systems", author: "Raghu Ramakrishnan", description: "Comprehensive guide to database design and implementation." },
    { title: "Web Technologies", author: "Uttam K. Roy", description: "Introduction to web development technologies and frameworks." },
    { title: "Operating Systems", author: "Galvin", description: "Concepts and design principles of modern operating systems." },
    { title: "Computer Networks", author: "Forouzan", description: "Fundamentals of networking protocols and architecture." },
    { title: "Software Engineering", author: "Roger S. Pressman", description: "A practitioner's approach to software design and development." },
    { title: "Python Programming", author: "Mark Lutz", description: "Learning Python programming with practical examples." },
    { title: "Java: The Complete Reference", author: "Herbert Schildt", description: "Comprehensive guide to Java programming language." },
    { title: "Cloud Computing", author: "Rajkumar Buyya", description: "Principles and paradigms of cloud computing technologies." },
    { title: "Mobile Application Development", author: "Reto Meier", description: "Professional Android and iOS app development." }
  ],
  "School of Design and Architecture (SODA)": [
    { title: "Architecture: Form, Space, and Order", author: "Francis D.K. Ching", description: "Classic visual reference for architectural design." },
    { title: "The Elements of Graphic Design", author: "Alex W. White", description: "Principles of composition in visual communication." },
    { title: "Interior Design Visual Presentation", author: "Maureen Mitton", description: "Guide to drawing, presentation, and communication in interior design." },
    { title: "Universal Principles of Design", author: "William Lidwell", description: "Critical concepts for designers, architects, and artists." },
    { title: "A History of Interior Design", author: "John Pile", description: "Evolution of interior design through different periods and cultures." },
    { title: "Thinking with Type", author: "Ellen Lupton", description: "Critical guide for designers, writers, editors, and students." },
    { title: "Materials for Design", author: "Victoria Ballard Bell", description: "Innovative materials for architectural and interior design." },
    { title: "The Design of Everyday Things", author: "Don Norman", description: "Psychology of everyday objects and usability principles." },
    { title: "Building Construction Illustrated", author: "Francis D.K. Ching", description: "Visual guide to construction systems and methods." },
    { title: "Sustainable Design", author: "Daniel E. Williams", description: "Ecological architecture and green building principles." }
  ],
  "School of Education (SOE)": [
    { title: "Educational Psychology", author: "Anita Woolfolk", description: "Understanding learning and teaching processes in education." },
    { title: "Curriculum Development", author: "Jon Wiles", description: "Planning, development and assessment in curriculum design." },
    { title: "Inclusive Education", author: "Garry Hornby", description: "Strategies for diverse learners in inclusive classrooms." },
    { title: "Educational Technology", author: "Mangal & Mangal", description: "Technology integration in teaching and learning environments." },
    { title: "Assessment in Education", author: "Robert J. Wright", description: "Principles and practices of educational assessment and evaluation." },
    { title: "Educational Research", author: "John W. Creswell", description: "Planning, conducting, and evaluating quantitative and qualitative research." },
    { title: "Learning Theories", author: "Dale H. Schunk", description: "Educational perspective on how people learn and develop." },
    { title: "Classroom Management", author: "Carolyn M. Evertson", description: "Strategies for creating effective learning environments." },
    { title: "Philosophy of Education", author: "Nel Noddings", description: "Philosophical foundations of educational thought and practice." },
    { title: "Child Development", author: "Laura E. Berk", description: "Understanding development from infancy through adolescence." }
  ],
  "School of Medical and Allied Sciences (SMAS)": [
    { title: "Anatomy and Physiology", author: "Tortora & Derrickson", description: "Comprehensive guide to human body structure and function." },
    { title: "Pharmacology", author: "K.D. Tripathi", description: "Essentials of medical pharmacology for healthcare professionals." },
    { title: "Medical Microbiology", author: "Patrick R. Murray", description: "Study of microorganisms and their role in human disease." },
    { title: "Clinical Biochemistry", author: "Chatterjea & Shinde", description: "Textbook of biochemistry for medical students." },
    { title: "Pathology", author: "Harsh Mohan", description: "Comprehensive guide to mechanisms of disease processes." },
    { title: "Medical Ethics", author: "Thomas Percival", description: "Ethical principles and dilemmas in medical practice." },
    { title: "Principles of Nutrition", author: "M. Swaminathan", description: "Nutritional science and its application in healthcare." },
    { title: "Medicinal Chemistry", author: "Ashutosh Kar", description: "Drug design, molecular properties, and therapeutic applications." },
    { title: "Pharmaceutical Analysis", author: "Higuchi", description: "Analytical techniques in pharmaceutical quality control." },
    { title: "Hospital Management", author: "Francis C.M.", description: "Administration and management of healthcare institutions." }
  ],
  "School of Agriculture (SOA)": [
    { title: "Principles of Agronomy", author: "T. Yellamanda Reddy", description: "Fundamental concepts in crop production and soil management." },
    { title: "Genetics and Plant Breeding", author: "B.D. Singh", description: "Principles and methods of crop improvement." },
    { title: "Soil Science", author: "N.C. Brady", description: "Nature and properties of soils in agricultural contexts." },
    { title: "Agricultural Economics", author: "H.K. Pant", description: "Economic principles applied to agricultural production and policy." },
    { title: "Plant Pathology", author: "R.S. Singh", description: "Study of plant diseases, their causes and management." },
    { title: "Horticulture", author: "Kumar", description: "Principles and practices of fruit and vegetable cultivation." },
    { title: "Agricultural Extension", author: "O.P. Dahama", description: "Communication and education in rural agricultural development." },
    { title: "Entomology", author: "Vasantharaj David", description: "Study of insects and their management in agriculture." },
    { title: "Irrigation and Water Management", author: "A.M. Michael", description: "Water resources and management for crop production." },
    { title: "Post-Harvest Technology", author: "K.V. Subrahmanyam", description: "Handling, storage and processing of agricultural produce." }
  ],
  "School of Media and Communication (SOMC)": [
    { title: "Mass Communication Theory", author: "Denis McQuail", description: "Foundations of mass media and communication studies." },
    { title: "Introduction to Journalism", author: "Richard Rudin", description: "Principles and practices of news reporting and writing." },
    { title: "Digital Media and Society", author: "Simon Lindgren", description: "Impact of digital technologies on communication and culture." },
    { title: "Advertising Principles", author: "Wells, Moriarty & Burnett", description: "Fundamentals of advertising strategy and creative development." },
    { title: "Public Relations", author: "Scott M. Cutlip", description: "Effective communications in organizational relationships." },
    { title: "Media Ethics", author: "Patrick Lee Plaisance", description: "Moral reasoning in journalism and mass communication." },
    { title: "Film Studies", author: "Ed Sikov", description: "Introduction to concepts, methods, and issues in film studies." },
    { title: "Communication Research Methods", author: "Don W. Stacks", description: "Quantitative and qualitative methods in communication research." },
    { title: "Television Production", author: "Gerald Millerson", description: "Handbook of studio-based television production techniques." },
    { title: "Social Media Marketing", author: "Dave Evans", description: "Strategies for engaging audiences through social platforms." }
  ],
  "School of Hospitality and Tourism (SOHT)": [
    { title: "Hotel Management", author: "Sudhir Andrews", description: "Introduction to hotel operations and management." },
    { title: "Food and Beverage Service", author: "Lillicrap and Cousins", description: "Training manual for food and beverage service professionals." },
    { title: "Tourism: Principles and Practice", author: "John Fletcher", description: "Comprehensive guide to tourism management and operations." },
    { title: "Front Office Management", author: "S.K. Bhatnagar", description: "Operations and procedures in hotel front office." },
    { title: "Housekeeping Management", author: "G. Raghubalan", description: "Professional management of housekeeping operations." },
    { title: "Event Management", author: "Lynn Van Der Wagen", description: "Planning and organizing successful events." },
    { title: "Hospitality Marketing", author: "David Bowie", description: "Strategic marketing for hotels, restaurants, and tourism." },
    { title: "Tourism Destination Planning", author: "Clare A. Gunn", description: "Development and management of tourism destinations." },
    { title: "Food Production Operations", author: "Parvinder S. Bali", description: "Comprehensive guide to professional kitchen operations." },
    { title: "Sustainable Tourism", author: "David Weaver", description: "Principles and practices of sustainable tourism development." }
  ]
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if we already have books - avoid duplicating
    const { data: existingBooks, error: countError } = await supabaseClient
      .from('books')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Error checking existing books: ${countError.message}`);
    }

    // If we already have books, don't add more
    if (existingBooks && existingBooks.length > 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Books already exist in the database',
        existing: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate books for each department
    const allBooks = [];
    for (const [department, books] of Object.entries(departmentBooks)) {
      const deptBooks = books.map(book => ({
        title: book.title,
        author: book.author,
        description: book.description,
        category: department,
        available: true,
        added_at: new Date().toISOString()
      }));
      allBooks.push(...deptBooks);
    }

    // Insert books into the database in batches of 20
    const batchSize = 20;
    let insertedCount = 0;
    
    for (let i = 0; i < allBooks.length; i += batchSize) {
      const batch = allBooks.slice(i, i + batchSize);
      const { error: insertError } = await supabaseClient
        .from('books')
        .insert(batch);
      
      if (insertError) {
        throw new Error(`Error inserting books batch: ${insertError.message}`);
      }
      
      insertedCount += batch.length;
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully generated ${insertedCount} sample books for all departments`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
