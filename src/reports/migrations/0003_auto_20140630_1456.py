# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0002_workitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='helper_text',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='workitem',
            name='item_comments',
            field=models.TextField(),
        ),
    ]
