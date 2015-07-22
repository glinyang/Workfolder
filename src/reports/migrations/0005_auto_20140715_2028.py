# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0004_project_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='workitem',
            name='week',
            field=models.IntegerField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='workitem',
            name='year',
            field=models.IntegerField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='project',
            name='project_eta',
            field=models.IntegerField(null=True, help_text='Project ETA'),
        ),
    ]
