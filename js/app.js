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
    return  {
        
    };
})();

const AppController = (function(ItemController, UIController){
    return {
        init: function()    {

        }
    };
})(ItemController, UIController);

AppController.init();
