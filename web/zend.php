<?php

//cd to base directory
chdir(dirname(__DIR__));

require_once 'vendor/autoload.php';

$app = Zend\Mvc\Application::init(require 'config/application.config.php');

$app->run();
