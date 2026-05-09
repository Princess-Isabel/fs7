from django.urls import path
from .views import (get_products, 
                    get_product_details, 
                    register_user, 
                    logout_user, 
                    update_cart_item, 
                    delete_cart_item, 
                    profile_view,
                    cart_view,
                    add_to_cart,
                    purchase_history_view,
                    delete_purchase_history_item
                    ) 



urlpatterns = [
    path('products/', get_products, name='products'),
    path('product/<int:pk>/', get_product_details, name='product-details'),

    #Authentication endpoints
    path('register/', register_user, name='register'),
    path('profile/', profile_view, name='profile'),
    path('logout/', logout_user, name='logout'),
    path('purchase-history/', purchase_history_view, name='purchase-history'),
    path('purchase-history/delete/<int:pk>/', delete_purchase_history_item, name='delete-purchase-history-item'),

    #cart api endpoints
    path('cart/add/', add_to_cart, name='add-to-cart'), # POST endpoint to add items to cart
    path('cart/update/<int:pk>/', update_cart_item, name='update-cart-item'), # PUT endpoint to update cart item quantity
    path('cart/delete/<int:pk>/', delete_cart_item, name='delete-cart-item'), # DELETE endpoint to remove item from cart
    path('cart/', cart_view, name='cart'), # GET endpoint to view cart items 
]
