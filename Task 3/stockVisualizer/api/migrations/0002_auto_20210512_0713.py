# Generated by Django 3.1 on 2021-05-12 07:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='stockdata',
            options={'ordering': ['id']},
        ),
    ]
