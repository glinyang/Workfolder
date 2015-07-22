# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0005_auto_20140715_2028'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='display_order',
            field=models.PositiveSmallIntegerField(default=0),
            preserve_default=True,
        ),
    ]
