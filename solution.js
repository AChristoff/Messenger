function attachEvents() {

    const url = 'https://messanger-b24ae.firebaseio.com/messages.json';
    let firstMessage = 0;
    let firstMessageKey = '';
    let historyClicked = false;

    let alert = $('#alert');
    setTimeout(() => alert.fadeIn(), 1000);
    setTimeout(() => alert.fadeOut(), 8000);


    $('#submit').on('click', sendMessage => {
        firstMessage++;

        let author = $('#author').val();
        let content = $('#content').val();
        let timeStamp = Date.now();
        let message = {
            author,
            content,
            timeStamp
        };

        $.ajax({
            method: 'POST',
            url,
            data: JSON.stringify(message),
            success: (id) => {

                $('#author').val('');
                $('#content').val('');

                if (firstMessage === 1) {
                    firstMessageKey = id.name;
                }

                $.ajax({
                    method: 'GET',
                    url,
                    success: (data) => {
                        let flag = false;
                        let newMessages = '';
                        for (let [key, message] of Object.entries(data)) {
                            if (key === firstMessageKey) {
                                flag = true;
                            }
                            if (flag && !historyClicked) {
                                newMessages += `${message.author}: ${message.content}\n`;
                                $('#messages').text(newMessages);
                            } else if (historyClicked) {
                                $('#refresh').click();
                            }
                        }
                    }
                })
            }
        })
    });

    $('#refresh').on('click', showMessages => {
        historyClicked = true;

        $.ajax({
            method: 'GET',
            url,
            success: (data) => {
                let allMessages = '';
                if (data !== null) {
                    for (let message of Object.values(data)) {
                        allMessages += `${message.author}: ${message.content}\n`
                    }
                    $('#messages').text(allMessages);
                } else {
                    $('#messages').text('No history')
                }
            }
        })
    });

    $('#delete').on('click', deleteHistory => {
        $.ajax({
            method: 'DELETE',
            url,
            success: () => {
                $('#messages').text('No history');
            }
        })
    });
}