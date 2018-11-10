const ItemController = (function()  {
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    const state = {
        items: [],
        currentItem: null,
        totalCalories: 0
    };

    return {
        addItem: function(name, calories) {
            const id = state.items.length > 0 ? state.items[state.items.length -1].id + 1: 0;
            calories = parseInt(calories);
            const newItem = new Item(id, name, calories);
            state.items.push(newItem);
            return newItem;
        },
        getItems: function() {
            return state.items;
        }
    };
})();

const UIController = (function(){
    const UIItems = {
        addBtn: '.add-btn',
        itemList: '#item-list',
        itemCaloriesInput: '#item-calories',
        itemNameInput: '#item-name'
    };
    return  {
        addItem: function(item) {
            const li = document.createElement('li');
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            document.querySelector(UIItems.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInputs: function() {
            document.querySelector(UIItems.itemCaloriesInput).value = '';
            document.querySelector(UIItems.itemNameInput).value = '';
        },
        getItemInput: function()    {
            return {
                calories: document.querySelector(UIItems.itemCaloriesInput).value,
                name: document.querySelector(UIItems.itemNameInput).value
            };       
        },
        getUIItems: function()  {
            return UIItems;
        },
        populateItems: function(items)   {
            let outputHTML = '';
            items.forEach(function(item) {
                outputHTML += `<li id="item-${item.id}" class="collection-item"><strong>${item.name}: </strong><em>${item.calories} Calories</em><a class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></li>`;
            });
            document.querySelector(UIItems.itemList).innerHTML = outputHTML;
        }
    };
})();

const AppController = (function(ItemController, UIController){
    const loadEventListeners = function()   {
        const UIItems = UIController.getUIItems();
        document.querySelector(UIItems.addBtn).addEventListener('click', addItemSubmit);
    }
    const addItemSubmit = function(e) {
        const itemInput = UIController.getItemInput();
        if (itemInput.calories !== '' && itemInput.name !== '') {
            const newItem = ItemController.addItem(itemInput.name, itemInput.calories);
            UIController.addItem(newItem);
            UIController.clearInputs();
        }
        e.preventDefault();
    }
    return {
        init: function()    {
            const items = ItemController.getItems();
            UIController.populateItems(items);
            loadEventListeners();
        }
    };
})(ItemController, UIController);

AppController.init();
