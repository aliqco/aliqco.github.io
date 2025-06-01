
// Request data class
class Data {
    constructor(id, name, time, priority, description) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.priority = priority;
        this.description = description;
    }

    get Id() {
        return this.id;
    }

    set Id(value) {
        this.id = value;
    }

    get Name() {
        return this.name;
    }

    set Name(value) {
        this.name = value;
    }

    get Time() {
        return this.time;
    }

    set Time(value) {
        this.time = value;
    }

    get Priority() {
        return this.priority;
    }

    set Priority(value) {
        this.priority = value;
    }

    get Description() {
        return this.description;
    }

    set Description(value) {
        this.description = value;
    }

    toString() {
        return `[ID: ${this.Id}, Name: ${this.Name}, Time: ${this.Time}, Priority: ${this.Priority}, Description: ${this.Description}]`;
    }
}

// BSTNode Class
class BSTNode {
    constructor(data) {
        this.Data = data;
        this.rchild = null;
        this.lchild = null;
    }
}

// BST Class
class BST {
    constructor() {
        this.Root = null;
    }

    static Insert(node, request) {
        if (node === null) return new BSTNode(request);

        if (request.Id < node.Data.Id)
            node.lchild = BST.Insert(node.lchild, request);
        else
            node.rchild = BST.Insert(node.rchild, request);

        return node;
    }

    static Search(node, id) {
        if (node === null || node.Data.Id === id)
            return node;

        if (id < node.Data.Id)
            return BST.Search(node.lchild, id);
        else
            return BST.Search(node.rchild, id);
    }

    static Delete(root, id) {
        if (root === null) return null;

        if (id === root.Data.Id) {
            if (root.lchild === null && root.rchild === null) {
                return null;
            } else if (root.lchild === null) {
                return root.rchild;
            } else if (root.rchild === null) {
                return root.lchild;
            } else {
                let successor = BST.MinNode(root.rchild);
                root.Data = successor.Data;
                root.rchild = BST.Delete(root.rchild, successor.Data.Id);
            }
        } else {
            if (id < root.Data.Id) {
                root.lchild = BST.Delete(root.lchild, id);
            } else {
                root.rchild = BST.Delete(root.rchild, id);
            }
        }
        return root;
    }

    static MinNode(node) {
        let current = node;
        while (current.lchild !== null) {
            current = current.lchild;
        }
        return current;
    }

    static InOrder(node) {
        if (node === null) return '';
        
        let left = BST.InOrder(node.lchild);
        let current = node.Data.toString() + '\n';
        let right = BST.InOrder(node.rchild);
        
        return left + current + right;
    }

    static BSTLen(node) {
        if (node === null) return 0;
        return 1 + BST.BSTLen(node.lchild) + BST.BSTLen(node.rchild);
        }
}

// MAX HEap class
class MaxHeap {
    constructor(size = 100) {
        this.heap = new Array(size);
        this.nextIndex = 1;
    }

    heapInsert(priority, id) {
        this.heap[this.nextIndex] = { Priority: priority, Id: id };
        let current = this.nextIndex;
        this.nextIndex++;
        this.adjust2Top(current);
    }

    adjust2Top(current) {
        while (current > 1 && this.heap[current].Priority > this.heap[Math.floor(current / 2)].Priority) {
            this.Swap(current, Math.floor(current / 2));
            current = Math.floor(current / 2);
        }
    }

    adjust2Down(current) {
        while (2 * current < this.nextIndex) {
            let left = 2 * current;
            let right = left + 1;
            let largerChild = left;

            if (right < this.nextIndex && this.heap[right].Priority > this.heap[left].Priority) {
                largerChild = right;
            }

            if (this.heap[current].Priority >= this.heap[largerChild].Priority) {
                break;
            }

            this.Swap(current, largerChild);
            current = largerChild;
        }
    }

    DelMax() {
        if (this.nextIndex === 1)
            throw new Error("Heap is empty.");

        let max = this.heap[1];
        this.Swap(1, this.nextIndex - 1);
        this.nextIndex--;
        this.adjust2Down(1);
        return max;
    }

    FindIndex(id) {
        for (let i = 1; i < this.nextIndex; i++) {
            if (this.heap[i].Id === id)
                return i;
        }
        return -1;
    }

    RemoveById(id) {
        let wantedIndex = this.FindIndex(id);
        if (wantedIndex === -1)
            return false;

        this.heap[wantedIndex] = this.heap[this.nextIndex - 1];
        this.nextIndex--;

        if (this.nextIndex <= 1)
            return true;

        if (wantedIndex > 1 && this.heap[wantedIndex].Priority > this.heap[Math.floor(wantedIndex / 2)].Priority) {
            this.adjust2Top(wantedIndex);
        } else {
            this.adjust2Down(wantedIndex);
        }

        return true;
    }

    HeapSort() {
        let size = this.nextIndex - 1;
        for (let i = size; i > 1; i--) {
            this.Swap(1, i);
            this.nextIndex--;
            this.adjust2Down(1);
        }
        this.nextIndex = size + 1;
        return this.heap.slice(1, size + 1);
    }


    GetPriority(id) {
        let index = this.FindIndex(id);
        if (index !== -1) {
            return this.heap[index].Priority;
        } else {
            return -1;
        }
    }

    Swap(i, j) {
        let temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    IsEmpty() {
        return this.nextIndex === 1;
    }

    PrintHeap() {
    let result = '';
        for (let i = 1; i <= this.nextIndex - 1; i++) {
            result += `[${i} => Priority: ${this.heap[i].Priority}, ID: ${this.heap[i].Id}]\n`;
            }
        return result;
    }
}

// Manager
class EmergencySystem {
    constructor() {
        this.bst = new BST();
        this.heap = new MaxHeap(100);
    }

    AddRequest(name, time, priority, description) {
        let id = Math.floor(Date.now() % (Math.random() * 10000));
        let request = new Data(id, name, time, priority, description);

        this.bst.Root = BST.Insert(this.bst.Root, request);
        this.heap.heapInsert(priority, id);

        return `Added request with ID: ${id}`;
    }

    SearchRequest(id) {
        let foundNode = BST.Search(this.bst.Root, id);
        if (foundNode !== null) {
            return `[ID: ${foundNode.Data.Id}, Name: ${foundNode.Data.Name}, Time: ${foundNode.Data.Time}, Priority: ${foundNode.Data.Priority}]`;
        } else {
            return `There is no request with ${id} id!`;
        }
    }

    HandleHighPriorityRequest() {
        if (this.heap.IsEmpty())
            throw new Error("heap is empty and there is not request to handle!");

        let max = this.heap.DelMax();
        let foundNode = BST.Search(this.bst.Root, max.Id);

        if (foundNode !== null) {
            let reqForHandle = foundNode.Data;
            this.bst.Root = BST.Delete(this.bst.Root, max.Id);
            return `Request by ID ${foundNode.Data.Id} and ${foundNode.Data.Priority} handled successfully.`;
        } else {
            throw new Error("Request not found in BST.");
        }
    }

    UpdatePriority(requestId, newPriority) {
        let foundNode = BST.Search(this.bst.Root, requestId);
        if (foundNode === null) {
            return `Request with ID ${requestId} not found in BST.`;
        }

        if (this.heap.FindIndex(requestId) === -1) {
            return `Request with ID ${requestId} not found in Heap.`;
        }


        let oldPriority = foundNode.Data.Priority;
        let removed = this.heap.RemoveById(requestId);
        foundNode.Data.Priority = newPriority;
        this.heap.heapInsert(newPriority, requestId);

        return `Updated request ID ${requestId}: priority ${oldPriority} => ${newPriority}.`;
    }

    PrintAllRequests() {
        let result = BST.InOrder(this.bst.Root);
        return result.trim() !== '' ? result.trim() : 'No requests found.';
    }

    PrintHeap() {
        return this.heap.PrintHeap() || 'Heap is empty.';
    }

    TotalRequests() {
        return BST.BSTLen(this.bst.Root);
    }

    ConvertToD3(node) {
        if (!node) return null;

        let obj = {
            name: `${node.Data.Id}`,
            children: []
        };

        if (node.lchild) obj.children.push(this.ConvertToD3(node.lchild));
        if (node.rchild) obj.children.push(this.ConvertToD3(node.rchild));

        if (obj.children.length === 0) delete obj.children;
        return obj;
    }

}

const emergencySystem = new EmergencySystem();


// Events
function addLog(message) {
    const log = document.querySelector('.log');
    const logContent = document.createElement('div');
    logContent.textContent = message;
    log.appendChild(logContent);
}

function addRequest() {
    const name = document.querySelector('.request-name-input').value;
    const priority = parseInt(document.querySelector('.request-priority-input').value);
    const description = document.querySelector('.request-desc-textarea').value;

    if (!name || !priority || !description) {
        addLog('ERROR: All fields are required!');
        return;
    }

    if (priority < 1 || priority > 10) {
        addLog('ERROR: Priority must be between 1 and 10!');
        return;
    }

    try {
        const result = emergencySystem.AddRequest(name, new Date(), priority, description);
        addLog(result);
        renderBST();

        document.querySelector('.request-name-input').value = '';
        document.querySelector('.request-priority-input').value = '';
        document.querySelector('.request-desc-textarea').value = '';
    } catch (e) {
        addLog(`ERROR! ${e.message}`);
    }
}

function updatePriority() {
    const requestId = parseInt(document.querySelector('.update-request-id-input').value);
    const newPriority = parseInt(document.querySelector('.update-request-priority-input').value);

    if (!requestId || !newPriority) {
        addLog('ERROR: ID and new priority are required!');
        return;
    }

    if (newPriority < 1 || newPriority > 10) {
        addLog('ERROR: Priority must be between 1 and 10!');
        return;
    }

    try {
        const result = emergencySystem.UpdatePriority(requestId, newPriority);
        addLog(result);
        
        document.querySelector('.update-request-id-input').value = '';
        document.querySelector('.update-request-priority-input').value = '';
    } catch (e) {
        addLog(`ERROR! ${e.message}`);
    }
}

function searchRequest() {
    const searchId = parseInt(document.querySelector('.search-request-id-input').value);

    if (!searchId) {
        addLog('ERROR: ID is required!');
        return;
    }

    const result = emergencySystem.SearchRequest(searchId);
    addLog(result);
    document.querySelector('.search-request-id-input').value = '';
}

function deleteRequest() {
    const delId = parseInt(document.querySelector('.del-request-id-input').value);
    if (!delId) {
        addLog('ERROR: ID is required!');
        return;
    }

    emergencySystem.bst.Root = BST.Delete(emergencySystem.bst.Root, delId);
    emergencySystem.heap.RemoveById(delId);
    document.querySelector('.del-request-id-input').value = '';
    renderBST();
}

function handleHighPriorityRequest() {
    try {
        const result = emergencySystem.HandleHighPriorityRequest();
        addLog(result);
        renderBST();
    } catch (e) {
        addLog('There is no request to handle!');
    }
}

function printAllRequests() {
    const totalNodes = emergencySystem.TotalRequests();
    const result = emergencySystem.PrintAllRequests();
    addLog('-- -- -- -- -- -- -- -- -- --');
    addLog('Total requests: ' + totalNodes);
    result.split('\n').forEach(node => {
        if (node.trim() !== '') addLog(node);
    });
    addLog('-- -- -- -- -- -- -- -- -- --');
}

function printHeap() {
    addLog('-- -- -- -- -- -- -- -- -- --');
    const result = emergencySystem.PrintHeap();
    result.split('\n').forEach(heap => {
        if (heap.trim() !== '') addLog(heap);
    });
    addLog('-- -- -- -- -- -- -- -- -- --');
}

function HeapSortPrint() {
    if (confirm('Are you sure to sort? its change the max heap structure!')) {
        try {
            let sortedHeap = emergencySystem.heap.HeapSort();
            addLog('-- -- -- -- -- -- -- -- -- --');
            sortedHeap.forEach(item => {
                addLog(`ID: ${item.Id}, Priority: ${item.Priority}`);
            });
            addLog('-- -- -- -- -- -- -- -- -- --');
        } catch (e) {
            addLog(`ERROR: ${e.message}`);
        }
    }
}


function clearLog() {
    document.querySelector('.log').textContent = '';
    alert('Cleared successfully.')
}

// BST Draw methods
function drawTree(BSTNodeData) {
    const container = document.querySelector(".BST-Tree");
    container.innerHTML = "";

    const width = 800;
    const height = 600;

    const svg = d3.select(".BST-Tree")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(40,40)");

    const root = d3.hierarchy(BSTNodeData);
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    // Draw links
    svg.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    // Draw nodes
    const node = svg.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .on("click", function(event, d) {
            let result =  emergencySystem.SearchRequest(parseInt(d.data.name));
            addLog(result);
        })

    node.append('circle')
        .attr('r', 20);
        
    node.append('text')
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .text(d => d.data.name);
}

function renderBST() {
    const BSTNodeData = emergencySystem.ConvertToD3(emergencySystem.bst.Root);
    if (BSTNodeData)
        drawTree(BSTNodeData);
}


// Test data
function AddDefaultRequests() {
    let currentDate = new Date(); 
    const defaultRequests = [
        { name: "Ali", time: currentDate, priority: 9, description: "Heart attack" },
        { name: "Hassan", time: currentDate, priority: 7, description: "Burn" },
        { name: "Jafar", time: currentDate, priority: 10, description: "Heart attack" },
        { name: "Yoones", time: currentDate, priority: 4, description: "Ear pain" },
        { name: "Karim", time: currentDate, priority: 8, description: "Accident" },
        { name: "Morteza", time: currentDate, priority: 1, description: "Accident" },
        { name: "Hakim", time: currentDate, priority: 5, description: "Accident" },
        { name: "Sadegh", time: currentDate, priority: 2, description: "Virus" },
        { name: "Ehsan", time: currentDate, priority: 3, description: "Accident" },
        { name: "Naeim", time: currentDate, priority: 5, description: "Flu" },
        { name: "Fateh", time: currentDate, priority: 1, description: "heartache" },
    ];

    defaultRequests.forEach(req => {
        const result = emergencySystem.AddRequest(req.name, req.time, req.priority, req.description);
        addLog(result);
    });

    renderBST();
}
window.addEventListener('load', AddDefaultRequests);
