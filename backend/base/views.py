from django.shortcuts import render
from .models import Product, cartUser
from .serializer import ProductSerializer, RegisterSerializer, UserSerializer, CartItemSerializer
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product_details(request, pk):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {
             'message': 'User registered successfully'   
            }, status=status.HTTP_201_CREATED,
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_user(request):
    refresh_token = request.data.get('refresh')

    if not refresh_token: 
        return Response({
            'error': "Refresh Token is required."
        }, status=status.HTTP_400_BAD_REQUEST,
        )
    
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()

    except TokenError:
        return Response({
            'error': "Invalid Token"
        }, status=status.HTTP_400_BAD_REQUEST,
        )
    
    return Response({
        'message': 'User Logged out successfully'
    }, status=status.HTTP_205_RESET_CONTENT,
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    cart_items = cartUser.objects.filter(user_id=request.user)
    serializer = CartItemSerializer(cart_items, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    serializer = CartItemSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    product = serializer.validated_data['product']
    qty = serializer.validated_data['qty']

    cart_item, created = cartUser.objects.get_or_create(
        user_id=request.user,
        product=product,
        defaults={'qty':qty},
    )

    if not created:
        cart_item.qty += qty
        cart_item.save()

    
    output_serializer = CartItemSerializer(cart_item)
    response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    return Response(output_serializer.data, status=response_status)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, pk):
    cart_item = get_object_or_404(cartUser, pk=pk, user_id=request.user)
    serializer = CartItemSerializer(cart_item, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_cart_item(request, pk):
    cart_item = get_object_or_404(cartUser, pk=pk, user_id=request.user)
    cart_item.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)






