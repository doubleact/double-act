// Utility class to analyze card statistics
export class StatisticsAnalyzer {
    constructor(cardData) {
        this.cardData = cardData;
        this.processData();
    }

    processData() {
        // Process character data
        this.characterData = {};
        this.actorData = {};
        this.decadeData = {};
        
        this.cardData.forEach(card => {
            // Process character data
            if (!this.characterData[card.character]) {
                this.characterData[card.character] = {
                    character: card.character,
                    actors: new Set(card.actors),
                    movies: new Set(card.movies),
                    type: card.type
                };
            } else {
                card.actors.forEach(actor => this.characterData[card.character].actors.add(actor));
                card.movies.forEach(movie => this.characterData[card.character].movies.add(movie));
            }

            // Process actor data
            card.actors.forEach(actor => {
                if (!this.actorData[actor]) {
                    this.actorData[actor] = {
                        actor: actor,
                        characters: new Set([card.character]),
                        movies: new Set([card.movies.find(m => m.includes(actor))].filter(Boolean)),
                        types: new Set([card.type])
                    };
                } else {
                    this.actorData[actor].characters.add(card.character);
                    const movie = card.movies.find(m => m.includes(actor));
                    if (movie) this.actorData[actor].movies.add(movie);
                    this.actorData[actor].types.add(card.type);
                }
            });

            // Process decade data
            card.movies.forEach(movie => {
                const match = movie.match(/\((\d{4})\)/);
                if (match) {
                    const year = parseInt(match[1]);
                    const decade = Math.floor(year / 10) * 10;
                    if (!this.decadeData[decade]) {
                        this.decadeData[decade] = {
                            decade: decade,
                            movies: new Set([movie]),
                            characters: new Set([card.character]),
                            actors: new Set(card.actors)
                        };
                    } else {
                        this.decadeData[decade].movies.add(movie);
                        this.decadeData[decade].characters.add(card.character);
                        card.actors.forEach(actor => this.decadeData[decade].actors.add(actor));
                    }
                }
            });
        });
    }

    // Get most versatile actors (played most different characters)
    getMostVersatileActors(limit = 10) {
        return Object.values(this.actorData)
            .map(data => ({
                actor: data.actor,
                characterCount: data.characters.size,
                movieCount: data.movies.size,
                characters: Array.from(data.characters).sort(),
                movies: Array.from(data.movies).sort(),
                types: Array.from(data.types).sort()
            }))
            .sort((a, b) => b.characterCount - a.characterCount)
            .slice(0, limit);
    }

    // Get most portrayed characters
    getMostPortrayedCharacters(limit = 10) {
        return Object.values(this.characterData)
            .map(data => ({
                character: data.character,
                actorCount: data.actors.size,
                movieCount: data.movies.size,
                actors: Array.from(data.actors).sort(),
                movies: Array.from(data.movies).sort(),
                type: data.type
            }))
            .sort((a, b) => b.actorCount - a.actorCount)
            .slice(0, limit);
    }

    // Get busiest decades
    getBusiestDecades() {
        return Object.entries(this.decadeData)
            .map(([decade, data]) => ({
                decade: `${decade}s`,
                movieCount: data.movies.size,
                characterCount: data.characters.size,
                actorCount: data.actors.size,
                movies: Array.from(data.movies).sort(),
                characters: Array.from(data.characters).sort(),
                actors: Array.from(data.actors).sort()
            }))
            .sort((a, b) => a.decade.localeCompare(b.decade));
    }

    // Get actors who crossed most card types
    getMostVersatileActorsByType(limit = 10) {
        return Object.values(this.actorData)
            .map(data => ({
                actor: data.actor,
                typeCount: data.types.size,
                types: Array.from(data.types).sort(),
                characters: Array.from(data.characters).sort(),
                movies: Array.from(data.movies).sort()
            }))
            .sort((a, b) => b.typeCount - a.typeCount)
            .slice(0, limit);
    }

    // Get distribution by card type
    getCardTypeDistribution() {
        const typeCounts = {};
        this.cardData.forEach(card => {
            typeCounts[card.type] = (typeCounts[card.type] || 0) + 1;
        });
        return typeCounts;
    }

    // Get most prolific actors (most movies)
    getMostProlificActors(limit = 10) {
        return Object.values(this.actorData)
            .map(data => ({
                actor: data.actor,
                movieCount: data.movies.size,
                characterCount: data.characters.size,
                movies: Array.from(data.movies).sort(),
                characters: Array.from(data.characters).sort()
            }))
            .sort((a, b) => b.movieCount - a.movieCount)
            .slice(0, limit);
    }

    // Get characters with the most different actors
    getCharactersByActorCount(limit = 10) {
        return Object.values(this.characterData)
            .map(data => ({
                character: data.character,
                actorCount: data.actors.size,
                actors: Array.from(data.actors).sort(),
                movies: Array.from(data.movies).sort(),
                type: data.type
            }))
            .sort((a, b) => b.actorCount - a.actorCount)
            .slice(0, limit);
    }

    // Get the most frequently remade characters
    getMostRemadeCharacters(limit = 10) {
        return Object.values(this.characterData)
            .map(data => ({
                character: data.character,
                movieCount: data.movies.size,
                actors: Array.from(data.actors).sort(),
                movies: Array.from(data.movies).sort(),
                type: data.type
            }))
            .sort((a, b) => b.movieCount - a.movieCount)
            .slice(0, limit);
    }

    // Get actors who have played the most remade characters
    getMostRemakeActors(limit = 10) {
        const actorCounts = {};
        
        Object.values(this.characterData).forEach(data => {
            data.actors.forEach(actor => {
                if (!actorCounts[actor]) {
                    actorCounts[actor] = {
                        actor: actor,
                        characters: new Set([data.character]),
                        movies: new Set([...data.movies].filter(movie => movie.includes(actor)))
                    };
                } else {
                    actorCounts[actor].characters.add(data.character);
                    [...data.movies]
                        .filter(movie => movie.includes(actor))
                        .forEach(movie => actorCounts[actor].movies.add(movie));
                }
            });
        });

        return Object.values(actorCounts)
            .map(data => ({
                actor: data.actor,
                characterCount: data.characters.size,
                characters: Array.from(data.characters).sort(),
                movies: Array.from(data.movies).sort()
            }))
            .sort((a, b) => b.characterCount - a.characterCount)
            .slice(0, limit);
    }

    // Get actors whose characters have been remade the most
    getActorsWithMostRemadeCharacters(limit = 10) {
        const actorRemakes = {};
        
        // First, get all characters and their remake counts
        const characterRemakes = {};
        Object.values(this.characterData).forEach(data => {
            characterRemakes[data.character] = {
                remakeCount: data.actors.size,
                originalActors: Array.from(data.actors),
                movies: Array.from(data.movies)
            };
        });

        // Then, for each actor, sum up the remakes of their characters
        Object.entries(characterRemakes).forEach(([character, data]) => {
            const originalActor = data.originalActors[0]; // Assume first actor is original
            if (originalActor) {
                if (!actorRemakes[originalActor]) {
                    actorRemakes[originalActor] = {
                        actor: originalActor,
                        totalRemakes: 0,
                        characters: [],
                        remakeDetails: []
                    };
                }
                
                // Only count if character was remade (more than 1 actor)
                if (data.remakeCount > 1) {
                    actorRemakes[originalActor].totalRemakes += data.remakeCount - 1; // Subtract 1 to not count original
                    actorRemakes[originalActor].characters.push(character);
                    actorRemakes[originalActor].remakeDetails.push({
                        character,
                        remakeCount: data.remakeCount - 1,
                        remadeBy: data.originalActors.slice(1), // All actors except original
                        movies: data.movies
                    });
                }
            }
        });

        return Object.values(actorRemakes)
            .filter(data => data.totalRemakes > 0)
            .sort((a, b) => b.totalRemakes - a.totalRemakes)
            .slice(0, limit);
    }

    // Get actors whose original roles were remade the most
    getActorsWithRemadeRoles(limit = 10) {
        const actorRemakes = {};
        
        // For each character, determine the original actor and subsequent remakes
        Object.values(this.characterData).forEach(data => {
            // Get chronologically sorted movies for this character
            const moviesList = Array.from(data.movies).sort((a, b) => {
                // Extract years from movie titles (assuming format includes year)
                const yearA = parseInt(a.match(/\((\d{4})\)/)?.[1] || '0');
                const yearB = parseInt(b.match(/\((\d{4})\)/)?.[1] || '0');
                return yearA - yearB;
            });

            // Find the earliest movie and its actor
            const earliestMovie = moviesList[0];
            if (!earliestMovie) return;

            // Find the actor from the earliest movie
            const originalActor = Array.from(data.actors).find(actor => 
                earliestMovie.includes(actor)
            );

            if (originalActor) {
                if (!actorRemakes[originalActor]) {
                    actorRemakes[originalActor] = {
                        actor: originalActor,
                        remadeRoles: [],
                        totalRemakes: 0
                    };
                }

                // Get all actors who played this role after the original actor
                const laterActors = Array.from(data.actors)
                    .filter(actor => actor !== originalActor);

                if (laterActors.length > 0) {
                    actorRemakes[originalActor].remadeRoles.push({
                        character: data.character,
                        remakeCount: laterActors.length,
                        remadeBy: laterActors,
                        originalMovie: earliestMovie,
                        remakes: moviesList.slice(1)
                    });
                    actorRemakes[originalActor].totalRemakes += laterActors.length;
                }
            }
        });

        return Object.values(actorRemakes)
            .filter(data => data.totalRemakes > 0)
            .sort((a, b) => b.totalRemakes - a.totalRemakes)
            .map(data => ({
                ...data,
                remadeRoles: data.remadeRoles.sort((a, b) => b.remakeCount - a.remakeCount)
            }))
            .slice(0, limit);
    }

    // Get actors who have played the most remakes/reboots
    getActorsPlayingRemakeRoles(limit = 10) {
        const actorRemakes = {};
        
        // For each character, determine chronological order of actors
        Object.values(this.characterData).forEach(data => {
            // Get chronologically sorted movies for this character
            const moviesList = Array.from(data.movies).sort((a, b) => {
                // Extract years from movie titles (assuming format includes year)
                const yearA = parseInt(a.match(/\((\d{4})\)/)?.[1] || '0');
                const yearB = parseInt(b.match(/\((\d{4})\)/)?.[1] || '0');
                return yearA - yearB;
            });

            // Find the earliest movie and its actor
            const earliestMovie = moviesList[0];
            if (!earliestMovie) return;

            // Find the actor from the earliest movie
            const originalActor = Array.from(data.actors).find(actor => 
                earliestMovie.includes(actor)
            );

            if (originalActor) {
                // Process all actors who played this role after the original
                moviesList.forEach(movie => {
                    // Find actor in this movie
                    const actor = Array.from(data.actors).find(a => movie.includes(a));
                    if (actor && actor !== originalActor) {
                        if (!actorRemakes[actor]) {
                            actorRemakes[actor] = {
                                actor: actor,
                                remakeRoles: [],
                                totalRemakes: 0
                            };
                        }

                        // Check if we already counted this character for this actor
                        const existingRole = actorRemakes[actor].remakeRoles.find(
                            role => role.character === data.character
                        );

                        if (!existingRole) {
                            actorRemakes[actor].remakeRoles.push({
                                character: data.character,
                                originalActor: originalActor,
                                originalMovie: earliestMovie,
                                yourVersion: movie,
                                otherVersions: moviesList.filter(m => m !== movie && m !== earliestMovie)
                            });
                            actorRemakes[actor].totalRemakes++;
                        }
                    }
                });
            }
        });

        return Object.values(actorRemakes)
            .sort((a, b) => b.totalRemakes - a.totalRemakes)
            .slice(0, limit);
    }

    // Get actors who have played multiple different characters
    getActorsWithMultipleCharacters(limit = 10) {
        const actorCharacters = {};
        
        Object.values(this.characterData).forEach(data => {
            data.actors.forEach(actor => {
                if (!actorCharacters[actor]) {
                    actorCharacters[actor] = {
                        actor: actor,
                        characters: new Set([data.character]),
                        movies: new Set([...data.movies].filter(movie => movie.includes(actor)))
                    };
                } else {
                    actorCharacters[actor].characters.add(data.character);
                    [...data.movies]
                        .filter(movie => movie.includes(actor))
                        .forEach(movie => actorCharacters[actor].movies.add(movie));
                }
            });
        });

        return Object.entries(actorCharacters)
            .map(([actor, data]) => ({
                actor,
                characterCount: data.characters.size,
                characters: Array.from(data.characters).sort(),
                movies: Array.from(data.movies).sort()
            }))
            .filter(item => item.characterCount > 1)
            .sort((a, b) => b.characterCount - a.characterCount)
            .slice(0, limit);
    }

    // Get years with most reboots/remakes/recasting
    getYearsWithMostReboots(limit = 5) {
        const yearData = {};
        
        // Process all movies to group by year
        Object.values(this.characterData).forEach(data => {
            const movies = Array.from(data.movies);
            movies.forEach(movie => {
                const match = movie.match(/\((\d{4})\)/);
                if (match) {
                    const year = match[1];
                    if (!yearData[year]) {
                        yearData[year] = {
                            year: year,
                            characters: new Set(),
                            movies: new Set(),
                            rebootCount: 0
                        };
                    }
                    yearData[year].characters.add(data.character);
                    yearData[year].movies.add(movie);
                    // If a character appears in multiple movies in the same year, count as reboot
                    yearData[year].rebootCount = Array.from(yearData[year].characters)
                        .reduce((total, char) => {
                            const moviesForChar = Array.from(yearData[year].movies)
                                .filter(m => this.characterData[char].movies.has(m));
                            return total + Math.max(0, moviesForChar.length - 1);
                        }, 0);
                }
            });
        });

        return Object.values(yearData)
            .sort((a, b) => b.rebootCount - a.rebootCount)
            .slice(0, limit);
    }

    // Get actors who have played the most rebooted characters
    getActorsWithMostRebootedCharacters(limit = 5) {
        const actorRebootData = {};

        Object.values(this.actorData).forEach(actorInfo => {
            const actor = actorInfo.actor;
            actorRebootData[actor] = {
                actor: actor,
                rebootedCharacters: [],
                totalRebootedRoles: 0
            };

            // Check each character played by this actor
            actorInfo.characters.forEach(character => {
                const characterInfo = this.characterData[character];
                // If character has been played by multiple actors, it's a rebooted character
                if (characterInfo.actors.size > 1) {
                    actorRebootData[actor].rebootedCharacters.push({
                        character: character,
                        totalActors: characterInfo.actors.size,
                        movies: Array.from(characterInfo.movies)
                            .filter(m => m.includes(actor)) // Only include movies where this actor played the character
                    });
                    actorRebootData[actor].totalRebootedRoles += 1;
                }
            });
        });

        return Object.values(actorRebootData)
            .filter(data => data.totalRebootedRoles > 0)
            .sort((a, b) => b.totalRebootedRoles - a.totalRebootedRoles)
            .slice(0, limit);
    }

    // Get deck distribution
    getDeckDistribution() {
        const deckCounts = {};
        this.cardData.forEach(card => {
            const type = card.type;
            deckCounts[type] = (deckCounts[type] || 0) + 1;
        });
        return deckCounts;
    }

    // Find original work and its reboots
    getRebootsByOriginal(limit = 10) {
        const originals = {};
        
        // First pass: Find earliest appearance for each character
        Object.values(this.characterData).forEach(charData => {
            const movies = Array.from(charData.movies);
            const sortedMovies = movies.sort((a, b) => {
                const yearA = parseInt(a.match(/\((\d{4})\)/)?.[1] || '9999');
                const yearB = parseInt(b.match(/\((\d{4})\)/)?.[1] || '9999');
                return yearA - yearB;
            });

            const originalWork = sortedMovies[0];
            if (!originalWork) return;

            const originalYear = parseInt(originalWork.match(/\((\d{4})\)/)?.[1] || '9999');
            
            if (!originals[originalWork]) {
                originals[originalWork] = {
                    title: originalWork,
                    year: originalYear,
                    characters: new Set([charData.character]),
                    reboots: new Set(),
                    rebootYears: {}
                };
            } else {
                originals[originalWork].characters.add(charData.character);
            }

            // Add all later works as reboots (excluding sequels)
            sortedMovies.slice(1).forEach(movie => {
                const isSequel = movie.toLowerCase().includes('sequel') || 
                               movie.toLowerCase().includes('part') ||
                               movie.match(/[2-9]$/);
                if (!isSequel) {
                    originals[originalWork].reboots.add(movie);
                    const year = movie.match(/\((\d{4})\)/)?.[1];
                    if (year) {
                        originals[originalWork].rebootYears[year] = 
                            (originals[originalWork].rebootYears[year] || 0) + 1;
                    }
                }
            });
        });

        // Convert to array and sort by number of reboots
        return Object.values(originals)
            .map(item => ({
                originalTitle: item.title,
                originalYear: item.year,
                characters: Array.from(item.characters),
                reboots: Array.from(item.reboots),
                rebootCount: item.reboots.size,
                rebootsByYear: item.rebootYears
            }))
            .sort((a, b) => b.rebootCount - a.rebootCount)
            .slice(0, limit);
    }

    // Get genre distribution
    getGenreDistribution() {
        const genres = {};
        const genreKeywords = {
            'Action': ['action', 'adventure', 'superhero', 'fight'],
            'Comedy': ['comedy', 'funny', 'humor'],
            'Drama': ['drama', 'dramatic'],
            'Horror': ['horror', 'scary', 'thriller'],
            'SciFi': ['sci-fi', 'science fiction', 'space', 'future'],
            'Fantasy': ['fantasy', 'magic', 'mythical'],
            'Crime': ['crime', 'detective', 'mystery'],
            'Romance': ['romance', 'love', 'romantic'],
            'Animation': ['animation', 'animated', 'cartoon'],
            'Family': ['family', 'children', 'kids']
        };

        this.cardData.forEach(card => {
            const movieText = Array.from(card.movies).join(' ').toLowerCase();
            Object.entries(genreKeywords).forEach(([genre, keywords]) => {
                if (keywords.some(keyword => movieText.includes(keyword))) {
                    genres[genre] = (genres[genre] || 0) + 1;
                }
            });
        });

        return genres;
    }

    // Get actors who have played different versions of the same character
    getActorCharacterConnections(limit = 10) {
        const connections = [];
        
        Object.values(this.characterData).forEach(charData => {
            if (charData.actors.size > 1) {
                const actors = Array.from(charData.actors);
                actors.forEach((actor1, i) => {
                    actors.slice(i + 1).forEach(actor2 => {
                        connections.push({
                            character: charData.character,
                            actor1: actor1,
                            actor2: actor2,
                            movies: Array.from(charData.movies)
                        });
                    });
                });
            }
        });

        return connections
            .sort((a, b) => b.movies.length - a.movies.length)
            .slice(0, limit);
    }

    // Get decades with most character reinventions
    getDecadeReinventions() {
        const decadeReinventions = {};
        
        Object.values(this.characterData).forEach(charData => {
            const movies = Array.from(charData.movies);
            movies.forEach(movie => {
                const year = parseInt(movie.match(/\((\d{4})\)/)?.[1] || '0');
                const decade = Math.floor(year / 10) * 10;
                
                if (!decadeReinventions[decade]) {
                    decadeReinventions[decade] = {
                        decade: decade,
                        characters: new Set(),
                        reinventions: 0,
                        examples: []
                    };
                }
                
                decadeReinventions[decade].characters.add(charData.character);
                if (charData.actors.size > 1) {
                    decadeReinventions[decade].reinventions++;
                    decadeReinventions[decade].examples.push({
                        character: charData.character,
                        movie: movie
                    });
                }
            });
        });

        return Object.values(decadeReinventions)
            .sort((a, b) => b.reinventions - a.reinventions);
    }
}
