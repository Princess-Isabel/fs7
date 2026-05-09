from rest_framework import serializers
from .models import Product, cartUser, order_item
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators = [UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model=User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = cartUser
        fields = ['card_id', 'product', 'product_id', 'qty']

class PurchaseHistorySerializer(serializers.ModelSerializer):
    product = ProductSerializer(source='product_id', read_only=True)
    purchase_date = serializers.DateTimeField(source='payment_id.paid_at', read_only=True)
    amount = serializers.SerializerMethodField()

    class Meta:
        model = order_item
        fields = ['order_id', 'product', 'qty', 'price', 'purchase_date', 'amount']

    def get_amount(self, obj):
        return obj.price * obj.qty
