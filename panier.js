  // Clé unique pour le stockage
        const STORAGE_KEY = 'persistent_shopping_cart';
        const EXPIRY_DAYS = 7; // Les articles expirent après 7 jours

        let cart = [];
        
        // 1. CHARGEMENT : Récupère les données au démarrage (Persistance Navigateur)
        function initCart() {
            const savedCart = localStorage.getItem(STORAGE_KEY);
            if (savedCart) {
                const data = JSON.parse(savedCart);
                
                // Vérification de l'expiration (7 jours d'inactivité)
                const lastActivity = new Date(data.lastUpdated);
                const now = new Date();
                const diffDays = (now - lastActivity) / (1000 * 60 * 60 * 24);

                if (diffDays < EXPIRY_DAYS) {
                    cart = data.items;
                    renderCart();
                } else {
                    console.log("Panier expiré après 7 jours.");
                    clearCart();
                }
            }
        }

        // 2. AJOUT : Modifie le panier et sauvegarde
        function addToCart(name, price) {
            cart.push({ name, price, addedAt: new Date() });
            saveAndRender();
        }

        // 3. SAUVEGARDE : Enregistre dans LocalStorage (Simule la persistance serveur)
        function saveAndRender() {
            const dataToSave = {
                items: cart,
                lastUpdated: new Date().toISOString() // Date pour le nettoyage auto
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            renderCart();
        }

        // 4. AFFICHAGE : Met à jour l'interface HTML
        function renderCart() {
            const container = document.getElementById('cart-items');
            const totalEl = document.getElementById('cart-total');
            const dateEl = document.getElementById('last-updated');
            
            container.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                total += item.price;
                container.innerHTML += `
                    <div class="item">
                        <span>${item.name} - ${item.price}€</span>
                        <button style="background:gray" onclick="removeItem(${index})">X</button>
                    </div>`;
            });

            totalEl.innerText = total;
            const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if(savedData) dateEl.innerText = "Dernière mise à jour : " + new Date(savedData.lastUpdated).toLocaleString();
        }

        function removeItem(index) {
            cart.splice(index, 1);
            saveAndRender();
        }

        function clearCart() {
            cart = [];
            localStorage.removeItem(STORAGE_KEY);
            renderCart();
            document.getElementById('last-updated').innerText = "";
        }

        // Lancement au chargement de la page
        initCart();