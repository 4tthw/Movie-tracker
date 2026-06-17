import * as readline from 'node:readline';
import { movies } from './movies.js';

// Создаем интерфейс для работы с терминалом
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Функция для показа меню
function showMenu() {
    console.log('\n========== КИНОТЕКА ==========');
    console.log('1. Показать все фильмы');
    console.log('2. Добавить фильм');
    console.log('3. Отметить фильм как просмотренный');
    console.log('4. Оценить фильм');
    console.log('5. Добавить в желаемое');
    console.log('6. Показать список желаемого');
    console.log('7. Выйти');
    console.log('================================\n');
}

// ВАШИ СУЩЕСТВУЮЩИЕ ФУНКЦИИ (немного изменены для работы с консолью)

function addMovie(title) {
    const newMovie = {
        title: title,
        watched: false,
        rating: null,
        wishlist: false
    };
    movies.push(newMovie);
    console.log(`✅ Фильм "${title}" добавлен!`);
}

function showMovies() {
    if (movies.length === 0) {
        console.log("📭 Список фильмов пуст");
        return;
    }
    
    console.log("\n📋 СПИСОК ФИЛЬМОВ:");
    movies.forEach((movie, index) => {
        const watchedStatus = movie.watched ? "✅ Просмотрен" : "⭕ Не просмотрен";
        const ratingText = movie.rating ? `${movie.rating}⭐` : "Нет оценки";
        const wishlistStatus = movie.wishlist ? "⭐ В желаемом" : "";
        
        console.log(`${index + 1}. ${movie.title}`);
        console.log(`   ${watchedStatus} | Оценка: ${ratingText} ${wishlistStatus}`);
        console.log(`   ───────────────────`);
    });
}

function markAsWatched(title) {
    const movie = movies.find((movie) => movie.title === title);
    
    if (!movie) {
        console.log(`❌ Фильм "${title}" не найден`);
        return;
    }
    
    if (movie.watched) {
        console.log(`ℹ️ Фильм "${title}" уже был просмотрен`);
        return;
    }
    
    movie.watched = true;
    console.log(`✅ Фильм "${title}" отмечен как просмотренный!`);
}

function rateMovie(title, rating) {
    const movie = movies.find((movie) => movie.title === title);
    
    if (!movie) {
        console.log(`❌ Фильм "${title}" не найден`);
        return;
    }
    
    if (rating < 1 || rating > 5) {
        console.log("❌ Оценка должна быть от 1 до 5");
        return;
    }
    
    movie.rating = rating;
    console.log(`✅ Фильму "${title}" поставлена оценка ${rating}⭐`);
}

function addToWishlist(title) {
    const movie = movies.find((movie) => movie.title === title);
    
    if (!movie) {
        console.log(`❌ Фильм "${title}" не найден`);
        return;
    }
    
    if (movie.wishlist) {
        console.log(`ℹ️ Фильм "${title}" уже в списке желаемого`);
        return;
    }
    
    movie.wishlist = true;
    console.log(`✅ Фильм "${title}" добавлен в список желаемого!`);
}

function showWishlist() {
    const wishlistMovies = movies.filter((movie) => movie.wishlist === true);
    
    if (wishlistMovies.length === 0) {
        console.log("📭 Список желаемого пуст");
        return;
    }
    
    console.log("\n⭐ СПИСОК ЖЕЛАЕМЫХ ФИЛЬМОВ:");
    wishlistMovies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
    });
}

// НОВЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ТЕРМИНАЛОМ

// Функция для получения ввода от пользователя
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Обработка выбора пользователя
async function handleChoice(choice) {
    switch(choice) {
        case '1':
            showMovies();
            break;
            
        case '2':
            const title = await askQuestion("Введите название фильма: ");
            if (title.trim()) {
                addMovie(title.trim());
            } else {
                console.log("❌ Название не может быть пустым");
            }
            break;
            
        case '3':
            const watchedTitle = await askQuestion("Введите название фильма, который вы посмотрели: ");
            if (watchedTitle.trim()) {
                markAsWatched(watchedTitle.trim());
            } else {
                console.log("❌ Название не может быть пустым");
            }
            break;
            
        case '4':
            const ratedTitle = await askQuestion("Введите название фильма для оценки: ");
            if (!ratedTitle.trim()) {
                console.log("❌ Название не может быть пустым");
                break;
            }
            const rating = await askQuestion("Введите оценку (от 1 до 5): ");
            const ratingNum = parseInt(rating);
            if (!isNaN(ratingNum)) {
                rateMovie(ratedTitle.trim(), ratingNum);
            } else {
                console.log("❌ Оценка должна быть числом");
            }
            break;
            
        case '5':
            const wishlistTitle = await askQuestion("Введите название фильма для добавления в желаемое: ");
            if (wishlistTitle.trim()) {
                addToWishlist(wishlistTitle.trim());
            } else {
                console.log("❌ Название не может быть пустым");
            }
            break;
            
        case '6':
            showWishlist();
            break;
            
        case '7':
            console.log("👋 До свидания!");
            rl.close();
            process.exit(0);
            break;
            
        default:
            console.log("❌ Неверный выбор. Пожалуйста, выберите от 1 до 7");
    }
}

// ГЛАВНАЯ ФУНКЦИЯ ЗАПУСКА
async function main() {
    console.log("🎬 Добро пожаловать в Кинотеку!");
    
    // Бесконечный цикл для показа меню
    while (true) {
        showMenu();
        const choice = await askQuestion("Выберите действие (1-7): ");
        await handleChoice(choice);
        
        // Пауза перед следующим показом меню
        if (choice !== '7') {
            await askQuestion("\nНажмите Enter, чтобы продолжить...");
        }
    }
}

// ЗАПУСК ПРОГРАММЫ
main().catch(console.error);