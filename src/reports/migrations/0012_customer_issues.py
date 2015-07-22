# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0011_auto_20140801_1249'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer_issues',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('headline', models.TextField(null=True, blank=True)),
                ('customer', models.CharField(null=True, max_length=30, blank=True)),
                ('report_date', models.CharField(null=True, max_length=20, blank=True)),
                ('report_by', models.CharField(null=True, max_length=20, blank=True)),
                ('bug_id', models.CharField(null=True, max_length=100, blank=True)),
                ('target_version', models.CharField(choices=[('DC 6.0.1 P1 HF', 'DC 6.0.1 P1 HF'), ('DC 6.0.1 FP2 HF', 'DC 6.0.1 FP2 HF'), ('DC 6.0.1 FP3 HF', 'DC 6.0.1 FP3 HF'), ('DC 7.0 FP1 HF', 'DC 7.0 FP1 HF'), ('DC 7.0 P2 HF', 'DC 7.0 P2 HF'), ('DC 7.0.1 HF', 'DC 7.0.1 HF')], null=True, max_length=100, blank=True)),
                ('modules', models.TextField(null=True, max_length=200, blank=True)),
                ('file_version', models.CharField(null=True, max_length=100, blank=True)),
                ('package_version', models.CharField(null=True, max_length=100, blank=True)),
                ('package_description', models.TextField(null=True, blank=True)),
                ('dev_owner', models.CharField(null=True, max_length=40, blank=True)),
                ('dsg', models.CharField(null=True, max_length=40, blank=True)),
                ('duplicate', models.CharField(null=True, max_length=10, blank=True)),
                ('capi_hf', models.CharField(null=True, max_length=200, blank=True)),
                ('capi_including', models.CharField(null=True, max_length=10, blank=True)),
                ('procative_notification', models.CharField(null=True, max_length=10, blank=True)),
                ('qa', models.CharField(null=True, max_length=10, blank=True)),
                ('qa_owner', models.CharField(null=True, max_length=100, blank=True)),
                ('status', models.CharField(null=True, max_length=50, blank=True)),
                ('release_date', models.CharField(null=True, max_length=20, blank=True)),
                ('fix_location', models.TextField(null=True, blank=True)),
                ('eta', models.CharField(null=True, max_length=50, blank=True)),
                ('fixcentralurl', models.TextField(null=True, blank=True)),
                ('other_bugs', models.TextField(null=True, blank=True)),
                ('hf_no', models.CharField(null=True, max_length=50, blank=True)),
                ('for_which_version', models.CharField(null=True, max_length=20, blank=True)),
                ('cq_note', models.TextField(null=True, blank=True)),
            ],
            options={
                'ordering': ['bug_id'],
                'get_latest_by': 'eta',
            },
        ),
    ]
