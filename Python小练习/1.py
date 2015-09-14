def rotate(nums, k):
    nums[:]=nums[len(nums)-k:]+nums[:len(nums)-k]
 
    print(nums)
rotate([1,2],7)
