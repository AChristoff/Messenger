function attachEvents() {

    const url = 'https://messanger-b24ae.firebaseio.com/messages.json';
    let firstMessage = 0;
    let firstMessageKey = '';
    let historyClicked = false;
    let username = '';

    setTimeout(() => $('#messages').text('Hi there,\nwelcome to my messenger!\n\nFeel free to try it 😃\n\nIt`s open to the world, so please hit the "Delete History" button,\nbefore you leave the chat.\n\nThanks!\nAlex'), 500);

    $('#author').on('click', () => {
        $('#author').attr('placeholder', '');
        if (firstMessage < 1) {
            $('#messages').text('')
        }
    });

    $('#author').mouseout('clickUp', () => {
        if ($('#author').val() === '' && firstMessage < 1) {
            $('#author').attr('placeholder', 'Enter Name');
        } else if ($('#author').val() === '') {
            $('#author').attr('placeholder', `Your name "${username}" is now autofill`);
        }
    });

    $('#content').on('click', () => {
        $('#content').attr('placeholder', '');
        if (firstMessage < 1) {
            $('#messages').text('')
        }
    });

    $('#content').mouseout('clickUp', () => {
        if ($('#content').val() === '' && firstMessage < 1) {
            $('#content').attr('placeholder', 'Enter your message');
        } else {
            $('#content').attr('placeholder', 'Enter next message');
        }
    });


    $('#submit').on('click', sendMessage => {

        let author = $('#author').val();
        let content = $('#content').val();
        let timeStamp = Date.now();
        let message;

        if (author === '' && firstMessage === 0) {
            $('#messages').text('Please enter your name!');
            return;
        } else if (content.includes('</script>') || content.includes('<script>') || content.includes('<script') ) {
            $('#messages').text('For Security purposes <script> is forbidden!');
            return;
        } else {
            firstMessage++;
        }

        if (author !== '') {
            username = author;
            message = {
                author,
                content,
                timeStamp
            };
        } else {
            message = {
                author: username,
                content,
                timeStamp
            };
        }

        $('#author').attr('placeholder', `Your name "${username}" is now autofill`);
        $('#content').attr('placeholder', 'Enter next message');

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
        let clearHistory = false;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover the messages!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                swal("The message history has been successfully deleted!", {
                    icon: "success",
                });

                $.ajax({
                    method: 'DELETE',
                    url,
                    success: () => {
                        $('#messages').text('No history');
                    }
                });

            } else {
                swal("Your message history  is safe!");
            }
        });

    });
}