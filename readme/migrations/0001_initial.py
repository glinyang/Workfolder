# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Readme',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('mytype', models.TextField(choices=[('6.0.1 Fix Pack 1', '6.0.1 Fix Pack 1'), ('6.0.1 Fix Pack 2', '6.0.1 Fix Pack 2'), ('6.0.1 Fix Pack 3', '6.0.1 Fix Pack 3'), ('7.0 Fix Pack 1', '7.0 Fix Pack 1'), ('7.0 Fix Pack 2', '7.0 Fix Pack 2'), ('7.0.1', '7.0.1')])),
                ('myapply', models.TextField(choices=[('Desktop', 'Desktop'), ('Server', 'Server'), ('Desktop/Server', 'Desktop/Server')])),
                ('number', models.TextField()),
                ('mydata1', models.TextField()),
                ('environment', models.TextField(choices=[('x64', 'x64'), ('x86', 'x86'), ('32-bit and 64-bit', '32-bit and 64-bit')])),
                ('Prerequisite_Interim_fix', models.TextField()),
                ('Bugs_Fixed', models.TextField()),
                ('Symptoms', models.TextField()),
                ('Cause', models.TextField()),
                ('Resolution', models.TextField()),
                ('Affected_Modules', models.TextField()),
                ('Discribe', models.TextField()),
                ('Accessories_Server', models.TextField()),
                ('Interview_Server', models.TextField()),
                ('Web_Server', models.TextField()),
                ('Author_Server', models.TextField()),
                ('Reporter_Server', models.TextField()),
                ('Remote_Server', models.TextField()),
                ('Survey_Server', models.TextField()),
            ],
        ),
    ]
