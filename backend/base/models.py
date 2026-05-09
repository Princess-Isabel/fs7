from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    countInStock = models.IntegerField()
    image = models.ImageField(upload_to = 'product_images/', null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.product_name} || Stock: {self.countInStock}'

class cartUser(models.Model):
    card_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    qty = models.IntegerField()

class paymentMethod(models.Model):
    payment_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    paymongo_payment_id = models.CharField(max_length=255)
    paymongo_status = models.CharField(max_length=255)


class order_item(models.Model):
    order_id = models.AutoField(primary_key=True)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    payment_id = models.ForeignKey(paymentMethod, on_delete=models.CASCADE)
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

class shippingAddress(models.Model):
    shipping_id = models.AutoField(primary_key=True)
    payment_id = models.ForeignKey(paymentMethod, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    address  = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
   