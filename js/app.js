const ItemController = (function(){
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    const state = {
        items: [
            {
                id: 0,
                name: 'Dinner',
                calories: 1200
            },
            {
                id: 1,
                name: 'Cookies',
                calories: 400
            },
            {
                id: 2,
                name: 'Eggs',
                calories: 300
            }
        ],
        currentItem: null,
        totalCalories: 0
    };

    return {
        getItems: function() {
            return state.items;
        }
    };
})();

const UIController = (function(){
    const UIItems = {
        itemList: '#item-list'
    };
    return  {
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
    return {
        init: function()    {
            const items = ItemController.getItems();
            UIController.populateItems(items);
        }
    };
})(ItemController, UIController);

AppController.init();
