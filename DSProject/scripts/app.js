
class Request {
    static usedIds = new Set();
    static maxId = 10000;

    constructor(id, name, time, priority, description) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.priority = this.setPriority(priority);
        this.description = description;
    }

    setPriority(value) {
        return (value >= 1 && value <= 10) ? value : 1;
    }

    static generateUniqueId() {
        let newId;
        do {
            newId = Math.floor(Math.random() * Request.maxId) + 1;
        } while (Request.usedIds.has(newId));
        
        Request.usedIds.add(newId);
        return newId;
    }

    toString() {
        return `[ID: ${this.id}, Name: ${this.name}, Time: ${this.time.toLocaleString()}, Priority: ${this.priority}, Description: ${this.description}]`;
    }
}

class BSTNode {
    constructor(data) {
        this.data = data;
        this.lchild = null;
        this.rchild = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(req) {
        this.root = this.insertRecursive(this.root, req);
    }

    insertRecursive(root, request) {
        if (root === null) return new BSTNode(request);
        
        if (request.id < root.data.id) {
            root.lchild = this.insertRecursive(root.lchild, request);
        } else {
            root.rchild = this.insertRecursive(root.rchild, request);
        }
        return root;
    }

    search(id) {
        const wantedNode = this.searchRecursive(this.root, id);
        return wantedNode ? wantedNode.data : null;
    }

    searchRecursive(root, id) {
        if (root === null || root.data.id === id) {
            return root;
        }
        return id < root.data.id ? 
            this.searchRecursive(root.lchild, id) : 
            this.searchRecursive(root.rchild, id);
    }

    delete(id) {
        this.root = this.deleteRecursive(this.root, id);
    }

    deleteRecursive(root, id) {
        if (root === null) return null;

        if (id === root.data.id) {
            if (root.lchild === null && root.rchild === null) {
                return null;
            } else if (root.lchild === null) {
                return root.rchild;
            } else if (root.rchild === null) {
                return root.lchild;
            } else {
                const successor = this.minNode(root.rchild);
                root.data = successor.data;
                root.rchild = this.deleteRecursive(root.rchild, successor.data.id);
            }
        } else {
            if (id < root.data.id) {
                root.lchild = this.deleteRecursive(root.lchild, id);
            } else {
                root.rchild = this.deleteRecursive(root.rchild, id);
            }
        }
        return root;
    }

    minNode(node) {
        let current = node;
        while (current.lchild !== null) {
            current = current.lchild;
        }
        return current;
    }

    inOrderTraversal() {
        const result = [];
        this.inOrderTraversalRecursive(this.root, result);
        return result;
    }

    inOrderTraversalRecursive(root, result) {
        if (root === null) return;
        this.inOrderTraversalRecursive(root.lchild, result);
        result.push(root.data);
        this.inOrderTraversalRecursive(root.rchild, result);
    }

    visualizeTree() {
        if (this.root === null) return "Empty tree";
        return this.visualizeNode(this.root, "", true);
    }

    visualizeNode(node, prefix, isLast) {
        if (node === null) return "";
        
        let result = prefix + (isLast ? "└── " : "├── ") + 
                    `ID:${node.data.id} (P:${node.data.priority})\n`;
        
        const children = [];
        if (node.lchild !== null) children.push(node.lchild);
        if (node.rchild !== null) children.push(node.rchild);
        
        for (let i = 0; i < children.length; i++) {
            const isLastChild = i === children.length - 1;
            result += this.visualizeNode(children[i], prefix + (isLast ? "    " : "│   "), isLastChild);
        }
        
        return result;
    }
}

// Max Heap Class
class MaxHeap {
    constructor(size = 100) {
        this.heap = new Array(size);
        this.nextIndex = 1;
    }

    heapInsert(priority, id) {
        this.heap[this.nextIndex] = { priority, id };
        let current = this.nextIndex;
        this.nextIndex++;
        this.adjust2Top(current);
    }

    adjust2Top(current) {
        while (current > 1 && this.heap[current].priority > this.heap[Math.floor(current / 2)].priority) {
            this.swap(current, Math.floor(current / 2));
            current = Math.floor(current / 2);
        }
    }

    adjust2Down(current) {
        while (2 * current < this.nextIndex) {
            const left = 2 * current;
            const right = left + 1;
            let largerChild = left;

            if (right < this.nextIndex && this.heap[right].priority > this.heap[left].priority) {
                largerChild = right;
            }

            if (this.heap[current].priority >= this.heap[largerChild].priority) {
                break;
            }

            this.swap(current, largerChild);
            current = largerChild;
        }
    }

    delMax() {
        if (this.nextIndex === 1) {
            throw new Error("Heap is empty.");
        }

        const max = this.heap[1];
        this.swap(1, this.nextIndex - 1);
        this.nextIndex--;
        this.adjust2Down(1);
        return max;
    }

    findIndex(id) {
        for (let i = 1; i < this.nextIndex; i++) {
            if (this.heap[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    removeById(id) {
        const wantedIndex = this.findIndex(id);
        if (wantedIndex === -1) return false;

        this.heap[wantedIndex] = this.heap[this.nextIndex - 1];
        this.nextIndex--;

        if (this.nextIndex <= 1) return true;

        if (wantedIndex > 1 && this.heap[wantedIndex].priority > this.heap[Math.floor(wantedIndex / 2)].priority) {
            this.adjust2Top(wantedIndex);
        } else {
            this.adjust2Down(wantedIndex);
        }

        return true;
    }

    contains(id) {
        return this.findIndex(id) !== -1;
    }

    swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    isEmpty() {
        return this.nextIndex === 1;
    }

    getHeapContents() {
        const contents = [];
        for (let i = 1; i < this.nextIndex; i++) {
            contents.push(this.heap[i]);
        }
        return contents;
    }
}

// Emergency System Class
class EmergencySystem {
    constructor() {
        this.bst = new BST();
        this.heap = new MaxHeap(100);
    }

    addRequest(name, time, priority, description) {
        const id = Request.generateUniqueId();
        const request = new Request(id, name, time, priority, description);

        this.bst.insert(request);
        this.heap.heapInsert(priority, id);

        return id;
    }

    handleHighPriorityRequest() {
        if (this.heap.isEmpty()) {
            throw new Error("No requests to process.");
        }

        const max = this.heap.delMax();
        const requestInBst = this.bst.search(max.id);

        if (requestInBst !== null) {
            this.bst.delete(max.id);
            return requestInBst;
        } else {
            throw new Error("Request not found in BST.");
        }
    }

    searchRequest(id) {
        const result = this.bst.search(id);
        if (result === null) {
            throw new Error(`Request with ID ${id} not found in BST.`);
        }
        return result;
    }

    updatePriority(requestId, newPriority) {
        const request = this.bst.search(requestId);
        if (request === null) {
            return { success: false, message: `Request with ID ${requestId} not found in BST.` };
        }

        if (!this.heap.contains(requestId)) {
            return { success: false, message: `Request with ID ${requestId} not found in Heap.` };
        }

        const oldPriority = request.priority;
        const removed = this.heap.removeById(requestId);
        
        if (!removed) {
            return { success: false, message: `Failed to remove request with ID ${requestId} from Heap.` };
        }

        request.priority = newPriority;
        this.heap.heapInsert(newPriority, requestId);

        return { 
            success: true, 
            message: `Updated request ID ${requestId}: priority ${oldPriority} → ${newPriority}.` 
        };
    }

    getAllRequests() {
        return this.bst.inOrderTraversal();
    }

    getHeapContents() {
        return this.heap.getHeapContents();
    }

    clear() {
        this.bst = new BST();
        this.heap = new MaxHeap(100);
        Request.usedIds.clear();
    }

    getBSTVisualization() {
        return this.bst.visualizeTree();
    }
}

// Initialize the system
const emergencySystem = new EmergencySystem();

// UI Functions
function showMessage(message, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    const messageDiv = document.createElement('div');
    
    let bgColor = 'bg-blue-100 text-blue-800';
    let icon = 'fas fa-info-circle';
    
    if (type === 'success') {
        bgColor = 'bg-green-100 text-green-800';
        icon = 'fas fa-check-circle';
    } else if (type === 'error') {
        bgColor = 'bg-red-100 text-red-800';
        icon = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        bgColor = 'bg-yellow-100 text-yellow-800';
        icon = 'fas fa-exclamation-triangle';
    }
    
    messageDiv.className = `${bgColor} p-4 rounded-md mb-4`;
    messageDiv.innerHTML = `<i class="${icon} mr-2"></i>${message}`;
    
    messageArea.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function updateAllRequestsDisplay() {
    const display = document.getElementById('allRequestsDisplay');
    const requests = emergencySystem.getAllRequests();
    
    if (requests.length === 0) {
        display.innerHTML = '<p class="text-gray-500 italic">No requests available</p>';
        return;
    }
    
    display.innerHTML = requests.map(request => `
        <div class="border-l-4 border-blue-500 bg-blue-50 p-3 mb-2 rounded">
            <div class="font-semibold text-blue-800">ID: ${request.id} - ${request.name}</div>
            <div class="text-sm text-gray-600">Priority: ${request.priority} | Time: ${request.time.toLocaleString()}</div>
            <div class="text-sm text-gray-700 mt-1">${request.description}</div>
        </div>
    `).join('');
}

function updateHeapDisplay() {
    const display = document.getElementById('heapDisplay');
    const heapContents = emergencySystem.getHeapContents();
    
    if (heapContents.length === 0) {
        display.innerHTML = '<p class="text-gray-500 italic">No requests in priority queue</p>';
        return;
    }
    
    display.innerHTML = heapContents.map((item, index) => `
        <div class="border-l-4 border-orange-500 bg-orange-50 p-3 mb-2 rounded">
            <div class="font-semibold text-orange-800">Position ${index + 1}: Priority ${item.priority}</div>
            <div class="text-sm text-gray-600">Request ID: ${item.id}</div>
        </div>
    `).join('');
}

function updateBSTVisualization() {
    const display = document.getElementById('bstVisualization');
    const visualization = emergencySystem.getBSTVisualization();
    
    if (visualization === "Empty tree") {
        display.innerHTML = '<p class="text-gray-500 italic">BST is empty</p>';
    } else {
        display.innerHTML = `<pre class="text-left bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">${visualization}</pre>`;
    }
}

function updateAllDisplays() {
    updateAllRequestsDisplay();
    updateHeapDisplay();
    updateBSTVisualization();
}

// Event Listeners
document.getElementById('addRequestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('requestName').value;
    const priority = parseInt(document.getElementById('requestPriority').value);
    const description = document.getElementById('requestDescription').value;
    
    try {
        const id = emergencySystem.addRequest(name, new Date(), priority, description);
        showMessage(`Added request with ID: ${id}`, 'success');
        
        // Clear form
        document.getElementById('addRequestForm').reset();
        
        updateAllDisplays();
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
});

document.getElementById('handleHighPriorityBtn').addEventListener('click', function() {
    try {
        const handledRequest = emergencySystem.handleHighPriorityRequest();
        showMessage(`Processed high priority request: ID ${handledRequest.id} - ${handledRequest.name}`, 'success');
        updateAllDisplays();
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
});

document.getElementById('searchBtn').addEventListener('click', function() {
    const searchId = parseInt(document.getElementById('searchId').value);
    
    if (isNaN(searchId)) {
        showMessage('Please enter a valid ID', 'warning');
        return;
    }
    
    try {
        const request = emergencySystem.searchRequest(searchId);
        showMessage(`Found: ${request.toString()}`, 'success');
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
});

document.getElementById('updatePriorityBtn').addEventListener('click', function() {
    const updateId = parseInt(document.getElementById('updateId').value);
    const newPriority = parseInt(document.getElementById('newPriority').value);
    
    if (isNaN(updateId) || isNaN(newPriority)) {
        showMessage('Please enter valid ID and priority values', 'warning');
        return;
    }
    
    if (newPriority < 1 || newPriority > 10) {
        showMessage('Priority must be between 1 and 10', 'warning');
        return;
    }
    
    const result = emergencySystem.updatePriority(updateId, newPriority);
    
    if (result.success) {
        showMessage(result.message, 'success');
        document.getElementById('updateId').value = '';
        document.getElementById('newPriority').value = '';
        updateAllDisplays();
    } else {
        showMessage(result.message, 'error');
    }
});

document.getElementById('clearAllBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all requests? This action cannot be undone.')) {
        emergencySystem.clear();
        showMessage('All requests cleared', 'success');
        updateAllDisplays();
    }
});

// Initialize with sample data
function initializeSampleData() {
    emergencySystem.addRequest("Ali", new Date(), 5, "Accident");
    emergencySystem.addRequest("Mahdi", new Date(), 10, "Heart attack");
    emergencySystem.addRequest("Mahmood", new Date(), 7, "Blood pressure");
    emergencySystem.addRequest("Ferdows", new Date(), 10, "High level burn");
    
    showMessage('Sample data loaded successfully', 'success');
    updateAllDisplays();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
});
