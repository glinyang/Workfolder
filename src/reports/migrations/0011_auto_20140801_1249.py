# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0010_weekplan'),
    ]

    operations = [
        migrations.AlterField(
            model_name='weekplan',
            name='plan_text',
            field=models.TextField(blank=True),
        ),
    ]
