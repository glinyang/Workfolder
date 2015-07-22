# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0008_itemtype_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='helper_text',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='project_eta',
            field=models.IntegerField(blank=True, help_text='Project ETA'),
        ),
        migrations.AlterField(
            model_name='workitem',
            name='item_comments',
            field=models.TextField(blank=True),
        ),
    ]
