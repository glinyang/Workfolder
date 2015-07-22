from django.contrib import admin

# Register your models here.
from reports.models import Project, ItemType, WorkItem, WeekPlan
# Register your models here.


class WorkItemInline(admin.TabularInline):
    model = WorkItem
    list_display =['year', 'week', 'user', 'item_type', 'item_text'] 
    extra = 3
    

class ProjectAdmin(admin.ModelAdmin):
    fieldsets = [
              ("Project Info", {'fields': ['project_name', 'project_eta', 'display_order', 'is_active']}),
              ("Project Comments", {'fields': ['helper_text']}),
            ]
    #inlines = [WorkItemInline]
    
    list_display =['display_order', 'project_name', 'project_eta', 'helper_text', 'is_active']
    list_filter = ['project_name']
    search_fields = ['project_name']
    ordering = ['display_order']
    
    
class ItemTypeAdmin(admin.ModelAdmin):
    list_display = ['display_order', 'text']
    ordering = ['display_order']
    
        
class WorkItemAdmin(admin.ModelAdmin):
    list_display = ['year', 'week', 'user', 'project', 'item_type', 'item_text', 'item_comments', 'item_efforts']
    list_filter = ['year', 'week', 'user', 'item_type', 'item_efforts']
    search_fields = ['item_text', 'item_comments']
    ordering = ['-year', '-week', 'user', 'project', 'item_type']
    
    
class WeekPlanAdmin(admin.ModelAdmin):
    list_display = ['year', 'week', 'user', 'plan_text']
    ordering = ['user']
        
            
admin.site.register(Project, ProjectAdmin)
admin.site.register(WorkItem, WorkItemAdmin)
admin.site.register(ItemType, ItemTypeAdmin)
admin.site.register(WeekPlan, WeekPlanAdmin)


from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
class MyUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'get_user_groups']
    
    def get_user_groups(self, user):
        groups = [g.name for g in user.groups.all()]
        return ''.join(groups)


admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)