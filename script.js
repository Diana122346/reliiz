const cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = `(${count})`;
    });
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const emptyMsg = document.getElementById('empty-cart');
    const summary = document.getElementById('cart-summary');
    const totalPriceEl = document.getElementById('total-price');

    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        summary.style.display = 'none';
        return;
    }

    emptyMsg.style.display = 'none';
    summary.style.display = 'block';

    const grouped = {};
    cart.forEach(item => {
        if (!grouped[item.title]) grouped[item.title] = { ...item, quantity: 0 };
        grouped[item.title].quantity += 1;
    });

    Object.values(grouped).forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const card = document.createElement('div');
        card.className = 'cart-card';

        const img = document.createElement('img');
        img.src = item.img;
        img.alt = item.title;

        const info = document.createElement('div');
        info.className = 'cart-info';

        const title = document.createElement('div');
        title.className = 'cart-title';
        title.textContent = item.title;

        const author = document.createElement('div');
        author.className = 'cart-author';
        author.textContent = `Автор: ${item.author}`;

        const price = document.createElement('div');
        price.className = 'cart-price';
        price.textContent = `${item.price} ₴`;

        info.appendChild(title);
        info.appendChild(author);
        info.appendChild(price);

        const quantity = document.createElement('div');
        quantity.className = 'quantity-control';

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.onclick = () => {
            const index = cart.findIndex(b => b.title === item.title);
            if (index !== -1) {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateCartCount();
            }
        };

        const qtyText = document.createElement('span');
        qtyText.textContent = item.quantity;

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.onclick = () => {
            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
        };

        quantity.appendChild(minusBtn);
        quantity.appendChild(qtyText);
        quantity.appendChild(plusBtn);

        card.appendChild(img);
        card.appendChild(info);
        card.appendChild(quantity);
        container.appendChild(card);
    });

    totalPriceEl.textContent = total;

    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.onclick = () => {
        alert('Дякуємо за покупку!');
        localStorage.removeItem('cart');
        cart.length = 0;
        renderCartItems();
        updateCartCount();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Викликаємо функцію для початкового відображення кількості

    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', e => {
            const bookCard = e.target.closest('.book-card');
            const title = bookCard.dataset.title;
            const author = bookCard.dataset.author;
            const price = parseFloat(bookCard.dataset.price);
            const img = bookCard.dataset.img;
            const newItem = { title, author, price, img, quantity: 1 }; // Початкова кількість - 1
            cart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`"${title}" додано до кошика!`);
        });
    });
});
