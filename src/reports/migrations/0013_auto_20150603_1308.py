# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0012_customer_issues'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customer_issues',
            old_name='fixcentralurl',
            new_name='fixcenterlurl',
        ),
    ]
