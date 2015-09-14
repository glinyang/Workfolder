class TreeNode(object):
    def __init__(self,left,root,right):
        self.left = left
        self.root = root
        self.right = right
        
class BinaryTree(object):
    def __init__(self,root=0):
        self.root = root
        
    def Isempty(self):
        if self.root is 0:
            return True
        else:
            return False
        
    def preOrder(self,TreeNode):
        if TreeNode is 0:
            return 
        print(TreeNode.root)
        self.preOrder(TreeNode.left)
        self.preOrder(TreeNode.right)
        
    def midOrder(self,TreeNode):
        if TreeNode is 0:
            return 
        self.midOrder(TreeNode.left)
        print(TreeNode.root)
        self.midOrder(TreeNode.right)
        
    def afterOrder(self,TreeNode):
        if TreeNode is 0:
            return 
        self.afterOrder(TreeNode.left)
        self.afterOrder(TreeNode.right) 
        print(TreeNode.root)
            
node1 = TreeNode(0,1,0)
node2 = TreeNode(0,3,0)
node3 = TreeNode(0,4,0)
node4 = TreeNode(node1,2,0)
node5 = TreeNode(node2,5,node3)
node6 = TreeNode(node4,6,node5)
node7 = TreeNode(node6,7,0)
node8 = TreeNode(0,1,0)
node9 = TreeNode(node8,8,0)

rootnode = TreeNode(node7,10,node9)

bt = BinaryTree(rootnode)

if bt.Isempty():
    print("empty")
else: 
    print('qianxu')
    bt.preOrder(bt.root)
    print('zhongxu')
    bt.midOrder(bt.root)
    print('houxu')
    bt.afterOrder(bt.root)
