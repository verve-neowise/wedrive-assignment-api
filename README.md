# WeDrive Assignment API

API для управления кошельком и картами пользователя.

## Технологии

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/wedrive-assignment-api.git
cd wedrive-assignment-api
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env и настройте подключение к базе данных:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/wedrive_db"
PORT=3000
```

4. Примените миграции базы данных:
```bash
npx prisma db push
```

5. Запустите сервер:
```bash
npm run dev
```

## API Endpoints

### Создание пользователя
```
POST /users
Content-Type: application/json

{
    "phone": "+998901234567"
}
```

### Получение информации о кошельке
```
GET /wallet
X-Account-Phone: +998901234567
```

### Получение списка карт
```
GET /cards
X-Account-Phone: +998901234567
```

### Добавление новой карты
```
POST /cards
X-Account-Phone: +998901234567
Content-Type: application/json

{
    "number": "8600123456789012",
    "expire_date": "12/25"
}
```

### Активация промокода
```
POST /promocode
X-Account-Phone: +998901234567
Content-Type: application/json

{
    "code": "WELCOME2024"
}
```

### Обновление метода оплаты
```
PUT /wallet/method
X-Account-Phone: +998901234567
Content-Type: application/json

{
    "active_method": "cash"
}
// или
{
    "active_method": "card",
    "active_card_id": 1
}
```

## Тестирование

Для тестирования API используйте файл `tests.http` в VS Code с расширением REST Client. 