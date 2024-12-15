const cardData = [
    {
        actors: ['Tom Cruise', 'Stuart Townsend'],
        character: 'Lestat de Lioncourt',
        movies: ['Interview with the Vampire', 'Queen of the Damned'],
        type: 1  // movie & movie // 001
    },
    {
        actors: ['Kristy Swanson', 'Sarah Michelle Gellar'],
        character: 'Buffy Anne Summers',
        movies: ['Buffy the Vampire Slayer', 'Buffy the Vampire Slayer (TV)'],
        type: 2  // movie & tv // 002
    },
    {
        actors: ['Dick York', 'Dick Sargent'],
        character: 'Darrin Stephens',
        movies: ['Bewitched (TV)', 'Bewitched (TV)'],
        type: 3  // tv & tv // 003
    },
    {
        actors: ['Michael Keaton', 'Christian Bale'],
        character: 'Bruce Wayne/Batman',
        movies: ['Batman, Batman Returns', 'Batman Begins, The Dark Knight,The Dark Knight Rises'],
        type: 5   // 004
    },
    {
        actors: ['Tobey Maguire', 'Tom Holland'],
        character: 'Peter Parker/Spider-Man',
        movies: ['Spider-Man, Spider-Man 2, Spider-Man 3', 'Captain America: Civil War, Spider-Man: Homecoming, Spider-Man: No Way Home, Spider-Man: Far From Home, Avengers: Infinity War, Avengers: Endgame'],
        type: 5   // 005
    },
    {
        actors: ['Sam Reid', 'Stuart Townsend'],
        character: 'Lestat de Lioncourt',
        movies: ['Interview with the Vampire (TV)', 'Queen of the Damned'],
        type: 2   // 006
    },
    {
        actors: ["Brian Cox", "Anthony Hopkins"],
        character: 'Hannibal Lecter',
        movies: ["Manhunter", "The Silence of the Lambs/Hannibal"],
        type: 1   // 007
    },
    { 
        actors: ["Tom Cruise", "Sam Reid"], 
        character: "Lestat de Lioncourt", 
        movies: ["Interview with the Vampire", "Interview with the Vampire (TV)"], 
        type: 1   // 008    
    },
    { 
        actors: ["Tom Cruise", "Alan Ritchson"], 
        character: "Jack Reacher", 
        movies: ["Jack Reacher/Jack Reacher: Never Go Back", "Reacher"],
        type: 2   // 009    
    },
    { 
        actors: ["Jake Gyllenhaal", "Patrick Swayze"], 
        character: "James Dalton", 
        movies: ["Road House (1989)", "Road House (2024)"],
        type: 1   // 010    
    },    
    { 
        actors: ["Jason Momoa", "Alan Ritchson"], 
        character: "Arthur Curry/Aquaman", 
        movies: ["Batman v Superman: Dawn of Justice/Justice League/Aquaman/The Flash/Aquaman and the Lost Kingdom", "Smallville"],
        type: 5   // 011    
    },    
    {
        actors: ["Jason Momoa", "Arnold Schwarzenegger"], 
        character: "Conan", 
        movies: ["Conan the Barbarian (2011)", "Conan the Barbarian (1982)"],    
        type: 1   // 012    
    },    
    {
        actors: ["Dwayne Johnson", "Ryan Gosling"], 
        character: "Hercules", 
        movies: ["Hercules", "Young Hercules (TV)"],   
        type: 2   // 013    
    },    
    {
        actors: ["Daniel Day-Lewis", "Benjamin Walker"], 
        character: "Abraham Lincoln", 
        movies: ["Lincoln", "Abraham Lincoln: Vampire Hunter"],   
        type: 1   // 014    
    },    
    {
        actors: ["Imelda Staunton", "Olivia Colman"], 
        character: "Queen Elizabeth II", 
        movies: ["The Crown", "The Crown"],         
        type: 3   // 015
    },    
    {
        actors: ["Kevin Costner", "Russell Crowe"], 
        character: "Robin Hood", 
        movies: ["Robin Hood: Prince of Thieves", "Robin Hood"],
        type: 1   // 016
    },    
    { 
        actors: ["Marlon Brando", "Russell Crowe"], 
        character: "Jor-El", 
        movies: ["Superman", "Man of Steel"],         
        type: 5   // 017
    },    
    {       
        actors: ["Kevin Costner", "John Schneider"], 
        character: "Robin Hood", 
        movies: ["Man of Steel", "Smallville (TV)"],
        type: 2   // 018
    },    
    {
        actors: ["Helen Mirren", "Claire Foy"], 
        character: "Queen Elizabeth II", 
        movies: ["The Queen", "The Crown"],         
        type: 3   // 019
    },    
    {   
        actors: ["Katherine McNamara", "Lilly Collins"], 
        character: "Clary Fray", 
        movies: ["Shadowhunters", "The Mortal Instruments: City of Bones"],         
        type: 2   // 020
    },    
    {
        actors: ["Anne Hathaway", "Zoe Kravitz"], 
        character: "Selina Kyle/Catwoman", 
        movies: ["The Dark Knight Rises", "The Batman"],         
        type: 5   // 021
    },    
    { 
        actors: ["Ben Affleck", "Chris Pine"], 
        character: "Jack Ryan", 
        movies: ["The Sum of All Fears", "Jack Ryan: Shadow Recruit"],  
        type: 1   // 022
    },    
    {
        actors: ["Sam Rockwell", "Josh Brolin"], 
        character: "George W. Bush", 
        movies: ["Vice", "W."],
        type: 1   // 023
    },    
    { 
        actors: ["Morgan Freeman", "Tyler Perry"], 
        character: "Detective Alex Cross", 
        movies: ["Along Came a Spider/Kiss the Girls", "Alex Cross"],
        type: 2   // 024
    },    
    {
        actors: ["Angelina Jolie", "Alicia Vikander"], 
        character: "Lara Croft", 
        movies: ["Lara Croft: Tomb Raider/Lara Croft: Tomb Raider - The Cradle of Life", "Tomb Raider"],
        type: 1   // 025
    },    
    {
        actors: ["Bill Skarsgard", "Brandon Lee"], 
        character: "Eric Draven", 
        movies: ["The Crow (2024)", "The Crow (1994)"],         
        type: 1   // 026
    },
    { 
        actors: ["Rachel Weisz", "Maria Bello"], 
        character: "Evelyn 'Evie' Carnahan", 
        movies: ["The Mummy/The Mummy Returns", "The Mummy: Tomb of the Dragon Emperor"],
        type: 1   // 027
    },
    { 
        actors: ["Kurt Russell", "Richard Dean Anderson"], 
        character: "Jack O'Neill", 
        movies: ["Stargate", "Stargate: SG-1 (TV)"],
        type: 2   // 028
    },
    { 
        actors: ["Rachelle Lefevre", "Bryce Dallas Howard"], 
        character: "Victoria", 
        movies: ["Twilight, The Twilight Saga: New Moon", "The Twilight Saga: Eclipse"],
        type: 1   // 029
    },
    { 
        actors: ["Jodie Foster", "Julianne Moore"], 
        character: "Clarice Starling", 
        movies: ["Silence of the Lambs", "Hannibal"],       
        type: 1   // 030
    },
    { 
        actors: ["Maggie Gyllenhaal", "Katie Holmes"], 
        character: "Rachel Dawes", 
        movies: ["The Dark Knight", "Batman Begins"],
        type: 5   // 031
    },
    { 
        actors: ["Terrence Howard", "Don Cheadle"], 
        character: "James Rhodes/Iron Patriot", 
        movies: ["Iron Man", "Iron Man 2/Iron Man 3/Avengers: Age of Ultron/Captain America: Civil War/Avengers: Infinity War/Avengers: Endgame"],
        type: 5   // 032
    },
    { 
        actors: ["Elisabeth Shue", "Claudia Wells"], 
        character: "Jennifer Parker", 
        movies: ["Back to the Future II/Back to the Future III", "Back to the Future"],
        type: 2   // 033
    },
    { 
        actors: ["Tyler Mane", "Liev Schreiber"], 
        character: "Victor Creed", 
        movies: ["X-Men", "X-Men Origins: Wolverine"],
        type: 5   // 034
    },
    { 
        actors: ["Kiefer Sutherland", "Jon Voight"], 
        character: "Franklin D. Roosevelt", 
        movies: ["The First Lady", "Pearl Harbor"],
        type: 2   // 035
    },
    { 
        actors: ["Dennis Quaid", "Clive Owen"], 
        character: "Bill Clinton", 
        movies: ["The Special Relationship", "Impeachment: American Crime Story"],
        type: 2   // 036
    },
    { 
        actors: ["Sean Connery", "Taron Egerton"], 
        character: "Robin Hood", 
        movies: ["Robin Hood", "Robin and Marian"],        
        type: 1   // 037
    },
    { 
        actors: ["Lena Headey", "Emilia Clarke"], 
        character: "Sarah Connor", 
        movies: ["Terminator: The Sarah Connor Chronicles", "Terminator Genisis"],        
        type: 2   // 038
    },
    { 
        actors: ["Lena Headey", "Linda Hamilton"], 
        character: "Sarah Connor", 
        movies: ["Terminator: The Sarah Connor Chronicles", "The Terminator/Terminator 2: Judgment Day/Terminator: Dark Fate"],        
        type: 2   // 039
    },
    { 
        actors: ["Kurt Russell", "Tim Allen"], 
        character: "Santa Claus", 
        movies: ["The Christmas Chronicles, The Christmas Chronicles: Part 2", "The Santa Clause, The Santa Clause 2, The Santa Clause 3: The Escape Clause"],
        type: 2   // 040
    },
    { 
        actors: ["Christian Bale", "Ben Affleck"], 
        character: "Bruce Wayne / Batman", 
        movies: ["Batman Begins, The Dark Knight, The Dark Knight Rises", "Superman V Batman, Justice League, The Flash"],  
        type: 5   // 041
    },
    { 
        actors: ["Charlize Theron", "Peyton List"], 
        character: "Aileen Wuornos", 
        movies: ["Monster", "Aileen Wuornos: American Boogeywoman"],
        type: 4   // 042
    },
    { 
        actors: ["Gary Oldman", "Ed Harris"], 
        character: "Ludwig van Beethoven", 
        movies: ["Immortal Beloved", "Copying Beethoven"],
        type: 4   // 043
    },
    { 
        actors: ["Michael Fassbender", "Ashton Kutcher"], 
        character: "Steve Jobs", 
        movies: ["Steve Jobs", "Jobs"],
        type: 4   // 044
    },
    { 
        actors: ["Jessica Biel", "Elizabeth Olsen"], 
        character: "Candy Montgomery", 
        movies: ["Candy (TV)", "Love and Death (TV)"],
        type: 4   // 045        
    },
    { 
        actors: ["Zac Efron", "Mark Harmon"], 
        character: "Ted Bundy", 
        movies: ["Extremely Wicked, Shockingly Evil and Vile", "The Deliberate Stranger (TV)"],
        type: 4   // 046        
    },
    { 
        actors: ["Jeremy Renner", "Ross Lynch"], 
        character: "Jeffery Dahmer", 
        movies: ["Dahmer", "My Friend Jeffery Dahmer"],
        type: 4   // 047        
    },
    { 
        actors: ["Marisa Tomei", "Drew Barrymore"], 
        character: "Amy Fisher", 
        movies: ["Casualties of Love: The Long Island Lolita Story", "The Amy Fisher Story"],
        type: 4   // 048        
    },
    { 
        actors: ["Emily Browning", "Malina Weissman"], 
        character: "Violet Baudelaire", 
        movies: ["A Series of Unfortunate Events", "A Series of Unfortunate Events (TV)"],
        type: 2   // 049    
    },
    { 
        actors: ["Anita Barone", "Jane Sibbett"], 
        character: "Carol Willick-Bunch", 
        movies: ["Friends", "Friends"],
        type: 3   // 050
    },
    { 
        actors: ["Lisa Robin Kelly", "Christina Moore"], 
        character: "Laurie Forman", 
        movies: ["That ’70s Show", "That ’70s Show"],
        type: 3   // 051    
    },
    { 
        actors: ["Janet Hubert-Whitten", "Daphne Reid"], 
        character: "Vivian Banks", 
        movies: ["The Fresh Prince of Bel-Air", "The Fresh Prince of Bel-Air"],
        type: 3   // 052        
    },
    { 
        actors: ["Shailene Woodley", "Willa Holland"], 
        character: "Kaitlin Cooper", 
        movies: ["The O.C.", "The O.C."],
        type: 3   // 053        
    },  
    { 
        actors: ["Alicia ‘Lecy’ Goranson", "Sarah Chalke"], 
        character: "Rebecca ‘Becky’ Conner-Healy", 
        movies: ["Roseanne", "Roseanne"],
        type: 3   // 054    
    },
    { 
        actors: ["Alessandra Torresani ", "Mae Whitman"], 
        character: "Ann Veal", 
        movies: ["Arrested Development", "Arrested Development"],
        type: 3   // 055    
    },
    { 
        actors: ["Henry Cavill", "Liam Hemsworth"], 
        character: "Geralt of Rivia ", 
        movies: ["The Witcher", "The Witcher"],
        type: 3   // 056    
    },
    { 
        actors: ["Anya Taylor-Joy", "Charlize Theron"], 
        character: "Furiosa", 
        movies: ["Furiosa: A Mad Max Saga", "Mad Max: Fury Road"],
        type: 1   // 057    
    },
    { 
        actors: ["Gene Wilder", "Johnny Depp"], 
        character: "Willy Wonka", 
        movies: ["Willy Wonka and the Chocolate Factory", "Charlie and the Chocolate Factory"],
        type: 1   // 058    
    },
    { 
        actors: ["Gene Wilder", "Timothée Chalamet"], 
        character: "Willy Wonka", 
        movies: ["Willy Wonka and the Chocolate Factory", "Wonka"],
        type: 1   // 059    
    },
    { 
        actors: ["Johnny Depp", "Timothée Chalamet"], 
        character: "Willy Wonka", 
        movies: ["Charlie and the Chocolate Factory", "Wonka"],
        type: 1   // 060    
    },
    { 
        actors: ["Iain Armitage", "Jim Parsons"], 
        character: "Sheldon Cooper", 
        movies: ["Young Sheldon", "The Big Bang Theory"],
        type: 3   // 061    
    },
    { 
        actors: ["James Franko", "Jeff Goldblum"], 
        character: "The Wizard of Oz", 
        movies: ["Oz the Great and Powerful", "Wicked"],
        type: 1   // 062
    },
    { 
        actors: ["James Franko", "Frank Morgan"], 
        character: "The Wizard of Oz", 
        movies: ["Oz the Great and Powerful", "The Wizard of Oz"],
        type: 1   // 063    
    },
    { 
        actors: ["Frank Morgan", "Jeff Goldblum"], 
        character: "The Wizard of Oz", 
        movies: ["The Wizard of Oz", "Wicked"],
        type: 1   // 064    
    },
    { 
        actors: ["Jude Law", "Richard Harris"], 
        character: "Albus Dumbledore", 
        movies: ["Fantastic Beasts: The Crimes of Grindelwald, Fantastic Beasts: The Secrets of Dumbledore", "Harry Potter and the Sorcerer's Stone, 'Harry Potter and the Chamber of Secrets"],
        type: 1   // 065    
    },
    { 
        actors: ["Jude Law", "Michael Gambon"], 
        character: "Albus Dumbledore", 
        movies: ["Fantastic Beasts: The Crimes of Grindelwald, Fantastic Beasts: The Secrets of Dumbledore", "Harry Potter and the Prisoner of Azkaban, Harry Potter and the Goblet of Fire, Harry Potter and the Order of the Phoenix, Harry Potter and the Half-Blood Prince, Harry Potter and the Deathly Hallows - Part 1, Harry Potter and the Deathly Hallows - Part 2"],
        type: 1   // 066    
    },
    { 
        actors: ["Richard Harris", "Michael Gambon"], 
        character: "Albus Dumbledore", 
        movies: ["Harry Potter and the Sorcerer's Stone, 'Harry Potter and the Chamber of Secrets", "Harry Potter and the Prisoner of Azkaban, Harry Potter and the Goblet of Fire, Harry Potter and the Order of the Phoenix, Harry Potter and the Half-Blood Prince, Harry Potter and the Deathly Hallows - Part 1, Harry Potter and the Deathly Hallows - Part 2"],
        type: 1   // 067    
    },
    { 
        actors: ["Tom Holland", "Andrew Garfield"], 
        character: "Peter Parker/Spider-Man", 
        movies: ["Captain America: Civil War, Spider-Man: Homecoming, Spider-Man: No Way Home, Spider-Man: Far From Home, Avengers: Infinity War, Avengers: Endgame", "The Amazing Spider-Man, The Amazing Spider-Man 2, Spider-Man: No Way Home"],
        type: 5   // 068    
    },
    { 
        actors: ["Andrew Garfield", "Toby Maguire"], 
        character: "Spider-Man/Peter Parker", 
        movies: ["The Amazing Spider-Man, The Amazing Spider-Man 2, Spider-Man: No Way Home", "Spider-Man, Spider-Man 2, Spider-Man 3, Spider-Man: No Way Home"],
        type: 5   // 069    
    },
    { 
        actors: ["Michael Keaton", "Val Kilmer"], 
        character: "Bruce Wayne/Batman", 
        movies: ["Batman, Batman Returns", "Batman Forever"],
        type: 5   // 070    
    },
    { 
        actors: ["Michael Keaton", "Adam West"], 
        character: "Bruce Wayne/Batman", 
        movies: ["Batman, Batman Returns", "Batman (TV)"],
        type: 5   // 071    
    },
    { 
        actors: ["Michael Keaton", "George Clooney"], 
        character: "Bruce Wayne/Batman", 
        movies: ["Batman, Batman Returns", "Batman and Robin, The Flash"],
        type: 5   // 072    
    },
    { 
        actors: ["Michael Keaton", "Robert Patterson "], 
        character: "Bruce Wayne/Batman", 
        movies: ["Batman, Batman Returns", "The Batman"],
        type: 5   // 073    
    },
    { 
        actors: ["Ezra Miller", "Grant Gustin"], 
        character: "Barry Allen/The Flash", 
        movies: ["Batman v Superman: Dawn of Justice, Suicide Squad, Justice League, The Flash, Peacemaker, The Flash (TV)", "Arrow, The Flash, Supergirl, Legends of Tomorrow, Batwoman, Titans"],
        type: 5   // 074    
    },
    { 
        actors: ["Ezra Miller", "John Wesley Shipp"], 
        character: "Barry Allen/The Flash", 
        movies: ["Batman v Superman: Dawn of Justice, Suicide Squad, Justice League, The Flash, Peacemaker, The Flash (TV)", "The Flash (1990), The Flash (2014), Arrow, Stargirl"],
        type: 5   // 075    
    },
    { 
        actors: ["Grant Gustin", "John Wesley Shipp"], 
        character: "Barry Allen/The Flash", 
        movies: ["Arrow, The Flash, Supergirl, Legends of Tomorrow, Batwoman, Titans", "The Flash (1990), The Flash (2014), Arrow, Stargirl"],
        type: 5   // 076    
    },
    { 
        actors: ["Henry Cavill ", "Christopher Reeve"], 
        character: "Clark Kent/Kal-el/Superman", 
        movies: ["Man of Steel, Batman v Superman: Dawn of Justice, Justice League, Black Adam", "Superman: The Movie, Superman II, Superman III, Superman IV"],
        type: 5   // 077    
    },
    { 
        actors: ["Brandon Routh", "Henry Cavill "], 
        character: "Clark Kent/Kal-el/Superman", 
        movies: ["Superman Returns", "Man of Steel, Batman v Superman: Dawn of Justice, Justice League, Black Adam"],
        type: 5   // 078    
    },
    { 
        actors: ["Brandon Routh", "Christopher Reeve"], 
        character: "Clark Kent/Kal-el/Superman", 
        movies: ["Superman Returns", "Superman: The Movie, Superman II, Superman III, Superman IV"],
        type: 5   // 079    
    },
    { 
        actors: ["Henry Cavill", "Dean Cain"], 
        character: "Clark Kent/Kal-el/Superman", 
        movies: ["Man of Steel, Batman v Superman: Dawn of Justice, Justice League, Black Adam", "Lois & Clark: The New Adventures of Superman"],
        type: 5   // 080    
    },
    { 
        actors: ["Tyler Hoechlin", "Dean Cain"], 
        character: "Clark Kent/Kal-el/Superman", 
        movies: ["Supergirl (TV), Arrow, The Flash, Batwoman, DC's Legends of Tomorrow", "Lois & Clark: The New Adventures of Superman"],
        type: 5   // 081    
    },
    { 
        actors: ["Henry Cavill", "David Corenswet"], 
        character: "Clark Kent/Kal-el/Superman", 
        movies: ["Man of Steel, Batman v Superman: Dawn of Justice, Justice League, Black Adam", "Superman (2025)"],
        type: 5   // 082    
    },
    { 
        actors: ["Henry Cavill", "Robert Downey Jr. "], 
        character: "Sherlock Homes", 
        movies: ["Enola Holmes, Enola Holmes 2", "Sherlock Holmes, Sherlock Holmes: A Game of Shadows"],
        type: 1   // 083    
    },
    { 
        actors: ["Robert Downey Jr. ", "Bennedict Cumberbatch"], 
        character: "Sherlock Homes", 
        movies: ["Sherlock Holmes, Sherlock Holmes: A Game of Shadows", "Sherlock"],
        type: 3   // 084    
    },
    { 
        actors: ["Robert Downey Jr. ", "Tommy Lee Miller"], 
        character: "Sherlock Homes", 
        movies: ["Sherlock Holmes, Sherlock Holmes: A Game of Shadows", "Elementary"],
        type: 3   // 085    
    },
    { 
        actors: ["Benedict Cumberbatch", "Tommy Lee Miller"], 
        character: "Sherlock Homes", 
        movies: ["Sherlock", "Elementary"],
        type: 3   // 086    
    },
    { 
        actors: ["Chris Evens", "Michael B. Jordan"], 
        character: "Jonny Storm/The Human Torch", 
        movies: ["Fantastic 4, Fantastic 4: Rise of the Silver Surfer", "Fantastic Four (2015)"],
        type: 5   // 087    
    },
    { 
        actors: ["Joseph Quinn", "Michael B. Jordan"], 
        character: "Jonny Storm/The Human Torch", 
        movies: ["The Fantastic Four", "Fantastic Four"],
        type: 5   // 088    
    },
    { 
        actors: ["Joseph Quinn", "Chris Evens"], 
        character: "Jonny Storm/The Human Torch", 
        movies: ["Fantastic 4, Fantastic 4: Rise of the Silver Surfer", "Fantastic Four"],
        type: 5   // 089    
    },
    { 
        actors: ["Jessica Alba", "Kate Mara"], 
        character: "Susan Storm/The Invisible Woman", 
        movies: ["Fantastic 4, Fantastic 4: Rise of the Silver Surfer", "Fantastic Four (2015)"],
        type: 5   // 090    
    },
    { 
        actors: ["Vanessa Kirby", "Kate Mara"], 
        character: "Susan Storm/The Invisible Woman", 
        movies: ["The Fantastic Four", "Fantastic Four"],
        type: 5   // 091
    },
    { 
        actors: ["Jessica Alba", "Vanessa Kirby"], 
        character: "Susan Storm/The Invisible Woman", 
        movies: ["Fantastic 4, Fantastic 4: Rise of the Silver Surfer", "The Fantastic Four"],
        type: 5   // 092    
    },
    { 
        actors: ["Ioan Gruffudd", "Miles Teller"], 
        character: "Reed Richards/Mr Fantastic", 
        movies: ["Fantastic 4, Fantastic 4: Rise of the Silver Surfer", "Fantastic Four (2015)"],
        type: 5   // 093    
    },
    { 
        actors: ["Pedro Pascal", "Miles Teller"], 
        character: "Reed Richards/Mr Fantastic", 
        movies: ["The Fantastic Four", "Fantastic Four"],
        type: 5   // 094    
    },
    { 
        actors: ["Ioan Gruffudd", "Pedro Pascal"], 
        character: "Reed Richards/Mr Fantastic", 
        movies: ["Fantastic 4, Fantastic 4: Rise of the Silver Surfer", "The Fantastic Four"],
        type: 5   // 095    
    },
    { 
        actors: ["Michael Chiklis", "Jamie Bell"], 
        character: "Ben Grimm/The Thing", 
        movies: ["Fantastic 4, Fantastic 4: Rise of the Silver Surfer", "Fantastic Four (2015)"],
        type: 5   // 096    
    },
    { 
        actors: ["Ebon Moss-Bachrach", "Jamie Bell"], 
        character: "Ben Grimm/The Thing", 
        movies: ["The Fantastic Four", "Fantastic Four"],
        type: 5   // 097    
    },
    { 
        actors: ["Michael Chiklis", "Ebon Moss-Bachrach"], 
        character: "Ben Grimm/The Thing", 
        movies: ["Fantastic 4, Fantastic 4: Rise of the Silver Surfer", "The Fantastic Four"],
        type: 5   // 098    
    },
    { 
        actors: ["Kurt Russell ", "Austin Butler"], 
        character: "Elvis Presley", 
        movies: ["Elvis (1979)", "Elvis (2022)"],
        type: 4   // 099    
    },
    { 
        actors: ["Margot Robbie", "Lady GaGa"], 
        character: "Harleen Quinzel/Harley Quinn", 
        movies: ["Suicide Squad, Birds of Prey, The Suicide Squad", "Joker: Folie à Deux"],
        type: 5   // 100    
    },
    { 
        actors: ["Ben Afflceck", "Charlie Cox"], 
        character: "Matthew Murdoch/Daredevil", 
        movies: ["Daredevil (2003)", "Daredevil (2015), The Defenders, Spider-Man: No Way Home, She-Hulk: Attorney at Law, Echo, Daredevil: Born Again"],
        type: 5   // 101    
    },
    { 
        actors: ["Thomas Jane", "Dolph Lundgren"], 
        character: "Frank Castle/The Punisher", 
        movies: ["The Punisher (2004)", "The Punisher (1989)"],
        type: 5   // 102    
    },
    { 
        actors: ["Ray Stevenson", "Dolph Lundgren"], 
        character: "Frank Castle/The Punisher", 
        movies: ["The Punisher: War Zone", "The Punisher (1989)"],
        type: 5   // 103    
    },
    { 
        actors: ["Ray Stevenson", "Thomas Jane"], 
        character: "Frank Castle/The Punisher", 
        movies: ["The Punisher: War Zone", "The Punisher (2004)"],
        type: 5   // 104    
    },
    { 
        actors: ["Ray Stevenson", "Jon Bernthal"], 
        character: "Frank Castle/The Punisher", 
        movies: ["The Punisher: War Zone", "Daredevil (TV), The Punisher (TV), Daredevil: Born Again"],
        type: 5   // 105    
    },
    { 
        actors: ["Thomas Jane", "Jon Bernthal"], 
        character: "Frank Castle/The Punisher", 
        movies: ["The Punisher (2004)", "Daredevil (TV), The Punisher (TV), Daredevil: Born Again"],
        type: 5   // 106    
    },
    { 
        actors: ["Dolph Lundgren", "Jon Bernthal"], 
        character: "Frank Castle/The Punisher", 
        movies: ["The Punisher (1989)", "Daredevil (TV), The Punisher (TV), Daredevil: Born Again"],
        type: 5   // 107    
    },
    {        
        actors: ["Mckenna Grace", "Brie Larson"], 
        character: "Carol Danvers", 
        movies: ["Captain Marvel", "Captain Marvel"],
        type: 5   // 108    
    },

];