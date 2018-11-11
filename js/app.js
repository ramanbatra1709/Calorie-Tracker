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
        getCurrentItem: function()  {
            return state.currentItem;
        },
        getItem : function(id)  {
            let item = null;
            state.items.forEach((value) => {
                if (value.id === id) {
                    item = value;
                }
            });
            return item;
        },
        getItems: function() {
            return state.items;
        },
        getTotalCalories: function()    {
            state.totalCalories = state.items.reduce((total, item) => total + item.calories, 0);
            return state.totalCalories;
        },
        setCurrentItem: function(item)  {
            state.currentItem = item;
        }
    };
})();

const UIController = (function(){
    const UIItems = {
        addBtn: '.add-btn',
        backBtn: '.back-btn',
        deleteBtn: '.delete-btn',
        editBtn: 'edit-item',
        itemList: '#item-list',
        itemCaloriesInput: '#item-calories',
        itemNameInput: '#item-name',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn'
    };
    return  {
        addItem: function(item) {
            const li = document.createElement('li');
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            document.querySelector(UIItems.itemList).insertAdjacentElement('beforeend', li);
        },
        addItemToForm: function()   {
            document.querySelector(UIItems.itemCaloriesInput).value = ItemController.getCurrentItem().calories;
            document.querySelector(UIItems.itemNameInput).value = ItemController.getCurrentItem().name;
        },
        clearInputs: function() {
            document.querySelector(UIItems.itemCaloriesInput).value = '';
            document.querySelector(UIItems.itemNameInput).value = '';
        },
        displayEditState: function(display)  {
            let displayAdd = 'inline', displayEdit = 'none';
            display ? (displayEdit = 'inline', displayAdd = 'none') : this.clearInputs();
            document.querySelector(UIItems.addBtn).style.display = displayAdd;
            document.querySelector(UIItems.backBtn).style.display = displayEdit;
            document.querySelector(UIItems.deleteBtn).style.display = displayEdit;
            document.querySelector(UIItems.updateBtn).style.display = displayEdit;
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
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UIItems.totalCalories).textContent = totalCalories;
        }
    };
})();

const AppController = (function(ItemController, UIController){
    const loadEventListeners = function()   {
        const UIItems = UIController.getUIItems();
        document.querySelector(UIItems.addBtn).addEventListener('click', addItemSubmit);
        document.querySelector(UIItems.itemList).addEventListener('click', updateItemSubmit);
    }
    const addItemSubmit = function(event) {
        const itemInput = UIController.getItemInput();
        if (itemInput.calories !== '' && itemInput.name !== '') {
            const newItem = ItemController.addItem(itemInput.name, itemInput.calories);
            UIController.addItem(newItem);
            UIController.showTotalCalories(ItemController.getTotalCalories());
            UIController.clearInputs();
        }
        event.preventDefault();
    }
    const updateItemSubmit = function(event) {
        if (event.target.classList.contains(UIController.getUIItems().editBtn))   {
            const itemId = parseInt(event.target.parentNode.parentNode.id.split('-')[1]);
            const item = ItemController.getItem(itemId);
            ItemController.setCurrentItem(item);
            UIController.addItemToForm();
            UIController.displayEditState(true);
        }
        event.preventDefault();
    }
    return {
        init: function()    {
            UIController.displayEditState(false);
            const items = ItemController.getItems();
            UIController.populateItems(items);
            UIController.showTotalCalories(ItemController.getTotalCalories());
            loadEventListeners();
        }
    };
})(ItemController, UIController);

AppController.init();
