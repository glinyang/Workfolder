# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0013_auto_20150603_1308'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customer_issues',
            options={'ordering': ['ecm'], 'get_latest_by': 'eta'},
        ),
        migrations.RenameField(
            model_name='customer_issues',
            old_name='dev_owner',
            new_name='dev',
        ),
        migrations.RemoveField(
            model_name='customer_issues',
            name='bug_id',
        ),
        migrations.RemoveField(
            model_name='customer_issues',
            name='capi_hf',
        ),
        migrations.RemoveField(
            model_name='customer_issues',
            name='capi_including',
        ),
        migrations.RemoveField(
            model_name='customer_issues',
            name='procative_notification',
        ),
        migrations.RemoveField(
            model_name='customer_issues',
            name='qa',
        ),
        migrations.AddField(
            model_name='customer_issues',
            name='ecm',
            field=models.CharField(null=True, max_length=100, blank=True),
        ),
        migrations.AddField(
            model_name='customer_issues',
            name='qa_reject',
            field=models.CharField(null=True, max_length=10, blank=True),
        ),
        migrations.AlterField(
            model_name='customer_issues',
            name='status',
            field=models.CharField(null=True, max_length=50, choices=[('Cancel', 'Cancel'), ('Released', 'Released'), ('Fixing', 'Fixing'), ('Not used', 'Not used'), ('Rejected', 'Rejected'), ('Testing', 'Testing'), ('Waiting feedback', 'Waiting feedback'), ('', '')], blank=True),
        ),
    ]
